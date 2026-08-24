import { DetailedResumeAnalysis, ResumeBulletAnalysis, ResumeSectionCheck, UploadedResumeFile } from '../components/career/careerTypes';
import { AIService } from './aiService';

// Standard role keyword libraries for ATS benchmark matching
const ROLE_KEYWORDS_MAP: Record<string, { core: string[]; recommended: string[]; tools: string[] }> = {
  'software engineer': {
    core: ['Data Structures', 'Algorithms', 'System Design', 'Git', 'OOP', 'REST API', 'Unit Testing', 'CI/CD', 'SQL'],
    recommended: ['Docker', 'Microservices', 'Clean Code', 'Agile', 'Design Patterns', 'Concurrency', 'Code Review'],
    tools: ['Git', 'GitHub', 'Postman', 'VS Code', 'Linux', 'Jira']
  },
  'machine learning engineer': {
    core: ['Python', 'PyTorch', 'TensorFlow', 'Scikit-learn', 'Machine Learning', 'Deep Learning', 'Data Preprocessing', 'Model Evaluation'],
    recommended: ['FastAPI', 'Docker', 'MLOps', 'MLflow', 'Hugging Face', 'NLP', 'Computer Vision', 'CUDA', 'Vector Databases'],
    tools: ['Git', 'Jupyter', 'Weights & Biases', 'ChromaDB', 'Pandas', 'NumPy']
  },
  'data scientist': {
    core: ['Python', 'SQL', 'Pandas', 'NumPy', 'Statistics', 'Exploratory Data Analysis', 'Machine Learning', 'Data Visualization'],
    recommended: ['Scikit-learn', 'Tableau', 'Power BI', 'Hypothesis Testing', 'Feature Engineering', 'BigQuery', 'A/B Testing'],
    tools: ['Jupyter Notebook', 'Tableau', 'Git', 'Seaborn', 'Matplotlib']
  },
  'frontend developer': {
    core: ['JavaScript', 'TypeScript', 'React', 'HTML5', 'CSS3', 'Responsive Design', 'REST API', 'Git', 'State Management'],
    recommended: ['Next.js', 'Tailwind CSS', 'Web Performance', 'Accessibility (a11y)', 'Redux', 'Zustand', 'Vite', 'Jest'],
    tools: ['Figma', 'Chrome DevTools', 'Postman', 'npm', 'GitHub']
  },
  'backend developer': {
    core: ['Node.js', 'Python', 'Java', 'Go', 'RESTful APIs', 'SQL', 'Database Design', 'Authentication', 'Git'],
    recommended: ['PostgreSQL', 'Redis', 'Docker', 'Microservices', 'GraphQL', 'Message Queues', 'Kafka', 'JWT', 'ORM'],
    tools: ['Postman', 'Docker', 'Linux', 'Swagger', 'Git']
  },
  'full stack developer': {
    core: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'SQL', 'REST APIs', 'Git', 'HTML/CSS', 'Database Management'],
    recommended: ['Next.js', 'PostgreSQL', 'Tailwind CSS', 'Docker', 'Cloud Deployment', 'Redis', 'GraphQL', 'Authentication'],
    tools: ['VS Code', 'Git', 'Postman', 'Docker', 'Vite']
  },
  'cloud & devops engineer': {
    core: ['Linux', 'Docker', 'Kubernetes', 'CI/CD', 'Git', 'AWS', 'Terraform', 'Networking', 'Bash Scripting'],
    recommended: ['Ansible', 'Prometheus', 'Grafana', 'Helm', 'GCP', 'Azure', 'Security Best Practices', 'Infrastructure as Code'],
    tools: ['GitHub Actions', 'Jenkins', 'Terraform', 'Docker', 'Kubernetes']
  },
  'mobile app developer': {
    core: ['Kotlin', 'Swift', 'Flutter', 'React Native', 'Mobile UI Design', 'State Management', 'REST API', 'Git'],
    recommended: ['Jetpack Compose', 'SwiftUI', 'Local Storage (Room/CoreData)', 'App Store Deployment', 'Offline Sync', 'Firebase'],
    tools: ['Android Studio', 'Xcode', 'Figma', 'Postman']
  },
  'cybersecurity analyst': {
    core: ['Network Security', 'Linux', 'Vulnerability Assessment', 'Cryptography', 'Firewalls', 'SIEM', 'Threat Analysis', 'Wireshark'],
    recommended: ['Penetration Testing', 'Incident Response', 'OWASP Top 10', 'Python Scripting', 'ISO 27001', 'SOC Operations'],
    tools: ['Wireshark', 'Burp Suite', 'Nmap', 'Splunk', 'Metasploit']
  }
};

const STRONG_ACTION_VERBS = [
  'Architected', 'Engineered', 'Developed', 'Designed', 'Optimized', 'Reduced', 'Accelerated',
  'Automated', 'Deployed', 'Implemented', 'Spearheaded', 'Constructed', 'Formulated', 'Streamlined',
  'Refactored', 'Integrated', 'Orchestrated', 'Scaled', 'Migrated', 'Built', 'Resolved', 'Established',
  'Published', 'Delivered', 'Created', 'Transformed', 'Pioneered', 'Upgraded', 'Standardized'
];

const WEAK_VERBS = [
  'Worked on', 'Responsible for', 'Helped with', 'Assisted', 'Handled', 'Did', 'Participated in',
  'Familiar with', 'Tried to', 'Involved in', 'Looked at', 'Supported', 'Made', 'Learned'
];

export class ResumeParserService {
  /**
   * Validates file size, extension, and content
   */
  static validateFile(file: File): { valid: boolean; error?: string } {
    if (!file) {
      return { valid: false, error: 'No file selected. Please select a resume file.' };
    }

    if (file.size === 0) {
      return { valid: false, error: 'The selected file is empty (0 bytes). Please upload a valid document.' };
    }

    const maxSizeBytes = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSizeBytes) {
      return { valid: false, error: 'File size exceeds 10MB limit. Please upload a smaller document.' };
    }

    const fileNameLower = file.name.toLowerCase();
    const validExtensions = ['.pdf', '.docx', '.doc', '.txt', '.rtf', '.md'];
    const hasValidExt = validExtensions.some(ext => fileNameLower.endsWith(ext));

    if (!hasValidExt) {
      return { valid: false, error: 'Unsupported file format. Please upload a PDF (.pdf), Word document (.docx), or plain text file (.txt).' };
    }

    return { valid: true };
  }

  /**
   * Extracts readable text from any supported file type (.pdf, .docx, .txt, .md, .rtf)
   */
  static async extractTextFromFile(
    file: File,
    onProgress?: (stage: string, percent: number) => void
  ): Promise<UploadedResumeFile> {
    onProgress?.('Validating document...', 15);
    const validation = this.validateFile(file);
    if (!validation.valid) {
      throw new Error(validation.error || 'Invalid file');
    }

    onProgress?.('Reading file contents...', 35);
    const fileName = file.name;
    const fileSize = file.size;
    const fileType = file.type || 'application/octet-stream';
    const fileNameLower = fileName.toLowerCase();

    let extractedText = '';

    if (fileNameLower.endsWith('.txt') || fileNameLower.endsWith('.md') || fileNameLower.endsWith('.rtf')) {
      onProgress?.('Extracting text content...', 70);
      extractedText = await file.text();
    } else if (fileNameLower.endsWith('.docx')) {
      onProgress?.('Parsing Word document XML...', 60);
      extractedText = await this.extractTextFromDocx(file);
    } else if (fileNameLower.endsWith('.pdf')) {
      onProgress?.('Extracting text streams from PDF...', 60);
      extractedText = await this.extractTextFromPdf(file);
    } else {
      // Fallback text reader
      onProgress?.('Reading document text...', 60);
      extractedText = await file.text();
    }

    onProgress?.('Sanitizing extracted text...', 90);
    extractedText = this.sanitizeText(extractedText);

    if (!extractedText || extractedText.trim().length < 25) {
      throw new Error(
        'Could not extract readable text from this file. If this is a scanned image PDF, please copy and paste your resume text directly, or upload a text-based PDF/DOCX.'
      );
    }

    const words = extractedText.trim().split(/\s+/).filter(Boolean);
    onProgress?.('Complete!', 100);

    return {
      fileName,
      fileSize,
      fileType,
      uploadedAt: new Date().toISOString(),
      extractedText,
      wordCount: words.length,
      characterCount: extractedText.length
    };
  }

  /**
   * Native DOCX text extraction by reading the ZIP archive entry word/document.xml
   */
  private static async extractTextFromDocx(file: File): Promise<string> {
    try {
      const buffer = await file.arrayBuffer();
      const uint8 = new Uint8Array(buffer);

      // Search for word/document.xml in the ZIP entries
      const textDecoder = new TextDecoder('utf-8');
      const zipContent = textDecoder.decode(uint8.subarray(0, Math.min(uint8.length, 100000)));

      // If plain text XML tags are present in uncompressed blocks
      const xmlTagMatches = zipContent.match(/<w:t[^>]*>(.*?)<\/w:t>/g);
      if (xmlTagMatches && xmlTagMatches.length > 5) {
        const textParts = xmlTagMatches.map(m => m.replace(/<w:t[^>]*>/, '').replace(/<\/w:t>/, ''));
        return textParts.join(' ');
      }

      // Try ZIP extraction using DecompressionStream or chunk search
      const docxText = await this.extractXmlFromZipBuffer(uint8);
      if (docxText && docxText.length > 30) {
        return docxText;
      }

      // Fallback: extract string literals from binary buffer
      return this.extractAsciiStrings(uint8);
    } catch (err) {
      console.warn('DOCX extraction fallback triggered:', err);
      const arrayBuffer = await file.arrayBuffer();
      return this.extractAsciiStrings(new Uint8Array(arrayBuffer));
    }
  }

  /**
   * Reads word/document.xml from raw ZIP array
   */
  private static async extractXmlFromZipBuffer(uint8: Uint8Array): Promise<string> {
    // ZIP local header signature is 0x04034b50 (PK\x03\x04)
    let offset = 0;
    const textDecoder = new TextDecoder('utf-8');

    while (offset < uint8.length - 30) {
      if (uint8[offset] === 0x50 && uint8[offset + 1] === 0x4B && uint8[offset + 2] === 0x03 && uint8[offset + 3] === 0x04) {
        const compMethod = uint8[offset + 8] | (uint8[offset + 9] << 8);
        const compSize = uint8[offset + 18] | (uint8[offset + 19] << 8) | (uint8[offset + 20] << 16) | (uint8[offset + 21] << 24);
        const fileNameLen = uint8[offset + 26] | (uint8[offset + 27] << 8);
        const extraFieldLen = uint8[offset + 28] | (uint8[offset + 29] << 8);

        const fileNameBytes = uint8.subarray(offset + 30, offset + 30 + fileNameLen);
        const entryName = textDecoder.decode(fileNameBytes);
        const dataOffset = offset + 30 + fileNameLen + extraFieldLen;

        if (entryName === 'word/document.xml' || entryName.endsWith('document.xml')) {
          const compData = uint8.subarray(dataOffset, dataOffset + compSize);
          
          if (compMethod === 0) {
            // Uncompressed
            const xml = textDecoder.decode(compData);
            return this.parseDocxXmlText(xml);
          } else if (compMethod === 8 && typeof DecompressionStream !== 'undefined') {
            // Deflate compressed
            try {
              const ds = new DecompressionStream('deflate-raw');
              const decompressedResponse = await new Response(
                new Response(compData).body?.pipeThrough(ds)
              ).arrayBuffer();
              const xml = textDecoder.decode(decompressedResponse);
              return this.parseDocxXmlText(xml);
            } catch (e) {
              console.warn('Decompressing word/document.xml failed, falling back to string extract:', e);
            }
          }
        }

        offset = dataOffset + Math.max(0, compSize);
      } else {
        offset++;
      }
    }

    return '';
  }

  private static parseDocxXmlText(xmlString: string): string {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(xmlString, 'text/xml');
      const paragraphs = doc.getElementsByTagName('w:p');
      const lines: string[] = [];

      for (let i = 0; i < paragraphs.length; i++) {
        const p = paragraphs[i];
        const textNodes = p.getElementsByTagName('w:t');
        let pText = '';
        for (let j = 0; j < textNodes.length; j++) {
          pText += textNodes[j].textContent || '';
        }
        if (pText.trim()) {
          lines.push(pText.trim());
        }
      }

      if (lines.length > 0) {
        return lines.join('\n');
      }

      // Regex fallback
      const textMatches = xmlString.match(/<w:t[^>]*>(.*?)<\/w:t>/g) || [];
      return textMatches.map(m => m.replace(/<w:t[^>]*>/, '').replace(/<\/w:t>/, '')).join(' ');
    } catch {
      const textMatches = xmlString.match(/<w:t[^>]*>(.*?)<\/w:t>/g) || [];
      return textMatches.map(m => m.replace(/<w:t[^>]*>/, '').replace(/<\/w:t>/, '')).join(' ');
    }
  }

  /**
   * Native PDF text extraction reading text objects, streams, and encoding chunks
   */
  private static async extractTextFromPdf(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const uint8 = new Uint8Array(buffer);
    const textDecoder = new TextDecoder('utf-8');
    const pdfRaw = textDecoder.decode(uint8);

    const extractedChunks: string[] = [];

    // 1. Extract uncompressed PDF text blocks (BT ... ET)
    const btRegex = /BT[\s\S]*?ET/g;
    let match: RegExpExecArray | null;
    while ((match = btRegex.exec(pdfRaw)) !== null) {
      const btBlock = match[0];
      
      // Match (text) Tj
      const tjMatches = btBlock.match(/\((.*?)\)\s*Tj/g);
      if (tjMatches) {
        for (const tj of tjMatches) {
          const inner = tj.replace(/^\(/, '').replace(/\)\s*Tj$/, '');
          const clean = this.unescapePdfText(inner);
          if (clean) extractedChunks.push(clean);
        }
      }

      // Match [ (t)(e)(x)(t) ] TJ
      const tjArrayMatches = btBlock.match(/\[(.*?)\]\s*TJ/g);
      if (tjArrayMatches) {
        for (const tja of tjArrayMatches) {
          const items = tja.match(/\((.*?)\)/g);
          if (items) {
            const combined = items.map(it => this.unescapePdfText(it.slice(1, -1))).join('');
            if (combined) extractedChunks.push(combined);
          }
        }
      }
    }

    // 2. If uncompressed streams didn't yield enough, attempt stream decompression
    if (extractedChunks.join(' ').length < 100 && typeof DecompressionStream !== 'undefined') {
      try {
        const streamRegex = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
        let streamMatch: RegExpExecArray | null;
        let processedStreams = 0;

        while ((streamMatch = streamRegex.exec(pdfRaw)) !== null && processedStreams < 30) {
          processedStreams++;
          const streamText = streamMatch[1];
          const streamBytes = new Uint8Array(streamText.length);
          for (let i = 0; i < streamText.length; i++) {
            streamBytes[i] = streamText.charCodeAt(i) & 0xff;
          }

          try {
            const ds = new DecompressionStream('deflate');
            const decompressed = await new Response(
              new Response(streamBytes).body?.pipeThrough(ds)
            ).arrayBuffer();
            const decompText = textDecoder.decode(decompressed);

            // Extract BT ... ET from decompressed stream
            let subMatch: RegExpExecArray | null;
            const subBt = /BT[\s\S]*?ET/g;
            while ((subMatch = subBt.exec(decompText)) !== null) {
              const bBlock = subMatch[0];
              const tjs = bBlock.match(/\((.*?)\)\s*Tj/g) || [];
              for (const tj of tjs) {
                const clean = this.unescapePdfText(tj.slice(1, -3));
                if (clean) extractedChunks.push(clean);
              }
              const tjArrays = bBlock.match(/\[(.*?)\]\s*TJ/g) || [];
              for (const tja of tjArrays) {
                const subItems = tja.match(/\((.*?)\)/g) || [];
                const comb = subItems.map(it => this.unescapePdfText(it.slice(1, -1))).join('');
                if (comb) extractedChunks.push(comb);
              }
            }
          } catch {
            // Stream was not standard zlib/deflate, skip
          }
        }
      } catch (e) {
        console.warn('PDF stream decompression skipped:', e);
      }
    }

    // 3. Fallback: extract ASCII words from printable byte sequences
    if (extractedChunks.join(' ').length < 80) {
      const asciiText = this.extractAsciiStrings(uint8);
      if (asciiText.length > 50) {
        extractedChunks.push(asciiText);
      }
    }

    return extractedChunks.join('\n');
  }

  private static unescapePdfText(str: string): string {
    return str
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '\r')
      .replace(/\\t/g, '\t')
      .replace(/\\\(/g, '(')
      .replace(/\\\)/g, ')')
      .replace(/\\\\/g, '\\')
      .trim();
  }

  private static extractAsciiStrings(uint8: Uint8Array): string {
    const lines: string[] = [];
    let currentWord: number[] = [];

    for (let i = 0; i < uint8.length; i++) {
      const byte = uint8[i];
      // Printable ASCII characters (32 to 126) + newline/tab
      if ((byte >= 32 && byte <= 126) || byte === 10 || byte === 13 || byte === 9) {
        currentWord.push(byte);
      } else {
        if (currentWord.length >= 4) {
          const str = String.fromCharCode(...currentWord).trim();
          // Filter out binary PDF markers like obj, endobj, xref, trailer, Catalog
          if (
            str &&
            !str.startsWith('/Filter') &&
            !str.startsWith('/Length') &&
            !str.startsWith('/Type') &&
            !str.includes('endobj') &&
            !str.includes('xref') &&
            !str.includes('trailer') &&
            str.length > 3
          ) {
            lines.push(str);
          }
        }
        currentWord = [];
      }
    }

    return lines.join(' ');
  }

  private static sanitizeText(text: string): string {
    return text
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/\t/g, '  ')
      .replace(/[^\x20-\x7E\n]/g, ' ') // Strip unprintable garbage
      .replace(/\n{3,}/g, '\n\n')
      .replace(/[ ]{2,}/g, ' ')
      .trim();
  }

  /**
   * Complete ATS and Resume Analysis Pipeline
   * 1. Attempts real Gemini AI analysis if configured
   * 2. Otherwise runs thorough deterministic ATS heuristic engine based on real user text
   */
  static async analyzeResumeText(
    resumeText: string,
    targetRole: string,
    userSkills: string[] = []
  ): Promise<DetailedResumeAnalysis> {
    const cleanText = this.sanitizeText(resumeText);
    const roleKey = (targetRole || 'software engineer').toLowerCase();

    // Check if Gemini API is available and configured
    if (AIService.isConfigured()) {
      try {
        const aiResult = await this.runGeminiResumeAnalysis(cleanText, targetRole, userSkills);
        if (aiResult && !aiResult.error && aiResult.overallScore > 0) {
          return aiResult;
        }
      } catch (err) {
        console.warn('Gemini resume analysis failed or rate limited. Using deterministic ATS heuristic engine:', err);
      }
    }

    // Deterministic ATS Heuristic Engine fallback based on actual extracted text
    return this.runHeuristicAtsAnalysis(cleanText, targetRole, userSkills);
  }

  /**
   * Calls Google Gemini with a rich ATS evaluation prompt
   */
  private static async runGeminiResumeAnalysis(
    resumeText: string,
    targetRole: string,
    userSkills: string[]
  ): Promise<DetailedResumeAnalysis> {
    const apiKey = AIService.getApiKey();
    const prompt = `You are the Lead ATS & Technical Resume Screener at a top tech company.
Analyze the candidate's actual resume text strictly based on the provided text for the target role: "${targetRole}".

Candidate Target Role: ${targetRole}
Known Current Skills: ${userSkills.join(', ')}

RESUME TEXT TO EVALUATE:
"""
${resumeText.substring(0, 5000)}
"""

Provide a strict, quantified, realistic ATS evaluation in valid JSON. No conversational text. No markdown blocks.

JSON Schema:
{
  "overallScore": number (0-100),
  "formattingScore": number (0-100),
  "keywordMatchScore": number (0-100),
  "impactScore": number (0-100),
  "sectionCompletenessScore": number (0-100),
  "strengths": string[],
  "weaknesses": string[],
  "missingKeywords": string[],
  "matchedKeywords": string[],
  "recommendedSkills": string[],
  "actionableSuggestions": string[],
  "bulletPointAnalysis": [
    {
      "original": string,
      "feedback": string,
      "improved": string,
      "category": "Google XYZ Formula" | "Impact" | "Action Verb" | "Brevity"
    }
  ],
  "sectionBreakdown": [
    {
      "name": "Contact Information" | "Professional Summary" | "Technical Skills" | "Work Experience" | "Projects" | "Education",
      "status": "present" | "missing" | "warning",
      "feedback": string
    }
  ]
}`;

    const models = ['gemini-2.5-flash', 'gemini-1.5-flash'];
    for (const model of models) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.15
            }
          })
        });

        if (!response.ok) continue;
        const result = await response.json();
        const rawText = result.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          const parsed = JSON.parse(rawText);
          return {
            id: 'res_' + Date.now(),
            overallScore: Math.min(100, Math.max(20, Math.round(Number(parsed.overallScore) || 75))),
            formattingScore: Math.min(100, Math.max(20, Math.round(Number(parsed.formattingScore) || 80))),
            keywordMatchScore: Math.min(100, Math.max(20, Math.round(Number(parsed.keywordMatchScore) || 70))),
            impactScore: Math.min(100, Math.max(20, Math.round(Number(parsed.impactScore) || 75))),
            sectionCompletenessScore: Math.min(100, Math.max(20, Math.round(Number(parsed.sectionCompletenessScore) || 85))),
            strengths: Array.isArray(parsed.strengths) && parsed.strengths.length > 0 ? parsed.strengths : ['Clear foundational technical background'],
            weaknesses: Array.isArray(parsed.weaknesses) && parsed.weaknesses.length > 0 ? parsed.weaknesses : ['Could increase quantifiable production metrics in project bullets'],
            missingKeywords: Array.isArray(parsed.missingKeywords) ? parsed.missingKeywords : [],
            matchedKeywords: Array.isArray(parsed.matchedKeywords) ? parsed.matchedKeywords : [],
            recommendedSkills: Array.isArray(parsed.recommendedSkills) ? parsed.recommendedSkills : [],
            actionableSuggestions: Array.isArray(parsed.actionableSuggestions) ? parsed.actionableSuggestions : [],
            bulletPointAnalysis: Array.isArray(parsed.bulletPointAnalysis) ? parsed.bulletPointAnalysis : [],
            sectionBreakdown: Array.isArray(parsed.sectionBreakdown) ? parsed.sectionBreakdown : [],
            analyzedRole: targetRole,
            analyzedAt: new Date().toISOString(),
            source: 'ai_gemini'
          };
        }
      } catch (e) {
        console.warn(`Gemini error on ${model}:`, e);
      }
    }

    throw new Error('Gemini API was unreachable');
  }

  /**
   * Deterministic ATS Heuristic Analyzer
   * Evaluates text based on actual keywords, action verbs, metrics, and structural sections
   */
  static runHeuristicAtsAnalysis(
    resumeText: string,
    targetRole: string,
    userSkills: string[] = []
  ): DetailedResumeAnalysis {
    const textLower = resumeText.toLowerCase();
    const roleKey = Object.keys(ROLE_KEYWORDS_MAP).find(k => (targetRole || '').toLowerCase().includes(k)) || 'software engineer';
    const roleConfig = ROLE_KEYWORDS_MAP[roleKey] || ROLE_KEYWORDS_MAP['software engineer'];

    // 1. Keyword Extraction & Matching
    const allKeywords = [...roleConfig.core, ...roleConfig.recommended, ...roleConfig.tools];
    const matchedKeywords: string[] = [];
    const missingKeywords: string[] = [];

    allKeywords.forEach(kw => {
      const kwLower = kw.toLowerCase();
      // Whole word or boundary search
      const regex = new RegExp(`\\b${kwLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (regex.test(resumeText) || textLower.includes(kwLower)) {
        matchedKeywords.push(kw);
      } else {
        missingKeywords.push(kw);
      }
    });

    // Add any user skills explicitly found in text
    userSkills.forEach(skill => {
      if (skill && !matchedKeywords.includes(skill)) {
        if (textLower.includes(skill.toLowerCase())) {
          matchedKeywords.push(skill);
        }
      }
    });

    const keywordRatio = allKeywords.length > 0 ? matchedKeywords.length / allKeywords.length : 0.5;
    const keywordMatchScore = Math.round(Math.min(98, Math.max(30, keywordRatio * 100 + (matchedKeywords.length > 5 ? 15 : 0))));

    // 2. Action Verbs & Quantified Metrics
    let actionVerbCount = 0;
    const detectedActionVerbs: string[] = [];
    STRONG_ACTION_VERBS.forEach(verb => {
      if (new RegExp(`\\b${verb}\\b`, 'i').test(resumeText)) {
        actionVerbCount++;
        detectedActionVerbs.push(verb);
      }
    });

    let weakVerbCount = 0;
    WEAK_VERBS.forEach(verb => {
      if (new RegExp(`\\b${verb}\\b`, 'i').test(resumeText)) {
        weakVerbCount++;
      }
    });

    // Count numbers, %, $, ms, x multipliers
    const metricMatches = resumeText.match(/\b\d+(\.\d+)?(%|ms|s|k|m|b|\+|x|\$)?\b/gi) || [];
    const metricCount = metricMatches.filter(m => !/^(19|20)\d{2}$/.test(m)).length; // Exclude years like 2024

    const impactScore = Math.round(
      Math.min(96, Math.max(35, (actionVerbCount * 6) + (metricCount * 5) - (weakVerbCount * 4) + 40))
    );

    // 3. Section Completeness Check
    const sectionBreakdown: ResumeSectionCheck[] = [
      {
        name: 'Contact Information',
        status: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(resumeText) ? 'present' : 'warning',
        feedback: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(resumeText)
          ? 'Email and contact coordinates detected'
          : 'No explicit professional email detected in header'
      },
      {
        name: 'Technical Skills',
        status: matchedKeywords.length >= 4 ? 'present' : matchedKeywords.length >= 2 ? 'warning' : 'missing',
        feedback: matchedKeywords.length >= 4
          ? `Detected ${matchedKeywords.length} verified technical skills matching ${targetRole}`
          : 'Skill section is sparse; add explicit technologies and framework versions'
      },
      {
        name: 'Work Experience / Internships',
        status: /(experience|intern|employment|work history)/i.test(resumeText) ? 'present' : 'warning',
        feedback: /(experience|intern|employment|work history)/i.test(resumeText)
          ? 'Experience section detected with role history'
          : 'No clear Work Experience heading found. If fresher, use "Project Experience"'
      },
      {
        name: 'Projects & Architecture',
        status: /(project|capstone|built|developed|application)/i.test(resumeText) ? 'present' : 'warning',
        feedback: /(project|capstone|built|developed|application)/i.test(resumeText)
          ? 'Projects section with technical implementation found'
          : 'Include at least 2 production-grade capstone projects with GitHub links'
      },
      {
        name: 'Education',
        status: /(education|university|college|b\.tech|b\.s\.|bachelor|degree|gpa)/i.test(resumeText) ? 'present' : 'warning',
        feedback: /(education|university|college|b\.tech|b\.s\.|bachelor|degree|gpa)/i.test(resumeText)
          ? 'Degree and university credentials found'
          : 'Ensure your degree, university name, and graduation year are clearly stated'
      }
    ];

    const presentSections = sectionBreakdown.filter(s => s.status === 'present').length;
    const sectionCompletenessScore = Math.round((presentSections / sectionBreakdown.length) * 100);

    // 4. Formatting & Length Score
    const wordCount = resumeText.trim().split(/\s+/).length;
    let formattingScore = 85;
    if (wordCount < 120) formattingScore -= 25;
    else if (wordCount > 1000) formattingScore -= 15;
    if (weakVerbCount > 3) formattingScore -= 10;
    formattingScore = Math.max(30, Math.min(95, formattingScore));

    // 5. Overall ATS Score calculation
    const overallScore = Math.round(
      keywordMatchScore * 0.35 +
      impactScore * 0.30 +
      sectionCompletenessScore * 0.20 +
      formattingScore * 0.15
    );

    // 6. Generate Strengths & Weaknesses
    const strengths: string[] = [];
    if (matchedKeywords.length >= 5) {
      strengths.push(`Strong keyword alignment for ${targetRole} (${matchedKeywords.slice(0, 4).join(', ')})`);
    }
    if (actionVerbCount >= 4) {
      strengths.push(`Good usage of action verbs (${detectedActionVerbs.slice(0, 3).join(', ')}) establishing ownership`);
    }
    if (metricCount >= 3) {
      strengths.push(`Quantified outcomes present (${metricCount} measurable metric instances detected)`);
    }
    if (strengths.length === 0) {
      strengths.push('Clear foundational structure and readable technical background');
    }

    const weaknesses: string[] = [];
    if (missingKeywords.length > 4) {
      weaknesses.push(`Missing critical industry keywords for ${targetRole}: ${missingKeywords.slice(0, 4).join(', ')}`);
    }
    if (metricCount < 3) {
      weaknesses.push('Few quantifiable metrics (add percentages, latency reductions, user counts, or speedups)');
    }
    if (weakVerbCount > 0) {
      weaknesses.push(`Passive wording detected (${weakVerbCount} passive phrases like "worked on" or "responsible for")`);
    }
    if (wordCount < 200) {
      weaknesses.push('Resume content is relatively brief; elaborate on architectural design decisions');
    }

    // 7. Extract & rewrite bullet points with Google XYZ formula
    const rawLines = resumeText.split('\n').map(l => l.trim()).filter(l => l.length > 20);
    const bulletCandidates = rawLines.filter(l => l.startsWith('•') || l.startsWith('-') || l.startsWith('*') || /^[A-Z]/.test(l)).slice(0, 3);

    const bulletPointAnalysis: ResumeBulletAnalysis[] = bulletCandidates.length > 0 ? bulletCandidates.map((orig, i) => {
      const cleanOrig = orig.replace(/^[•\-*]\s*/, '');
      const hasMetric = /\d/.test(cleanOrig);
      return {
        original: cleanOrig,
        category: 'Google XYZ Formula',
        feedback: hasMetric
          ? 'Strong technical scope; enhance the specific architectural trade-off context.'
          : 'Lacks measurable impact. Structure with: Accomplished [X], measured by [Y], by doing [Z].',
        improved: `Engineered ${cleanOrig.replace(/^(worked on|helped with|built|created)/i, '').trim()} utilizing ${matchedKeywords[i % matchedKeywords.length] || 'modern best practices'}, achieving 40% latency reduction and automated deployment testing.`
      };
    }) : [
      {
        original: `Developed a web service for ${targetRole} workflows using standard libraries.`,
        category: 'Google XYZ Formula',
        feedback: 'Too generic. Quantify the throughput, concurrency, and architecture.',
        improved: `Architected a high-throughput microservice using ${matchedKeywords[0] || 'Python'} and ${matchedKeywords[1] || 'PostgreSQL'}, reducing P99 latency by 35% across 50,000+ daily requests.`
      }
    ];

    // 8. Actionable Suggestions
    const actionableSuggestions: string[] = [
      `Incorporate missing high-frequency keywords: ${missingKeywords.slice(0, 4).join(', ')}.`,
      'Apply the Google XYZ formula (Accomplished [X] measured by [Y] by doing [Z]) to all project bullet points.',
      'Add direct GitHub repository links and live demo URLs to validate real-world code implementation.',
      'Ensure standard clean single-column layout without tables or graphics for optimal ATS parser throughput.'
    ];

    return {
      id: 'res_' + Date.now(),
      overallScore,
      formattingScore,
      keywordMatchScore,
      impactScore,
      sectionCompletenessScore,
      strengths,
      weaknesses,
      missingKeywords: missingKeywords.slice(0, 8),
      matchedKeywords: matchedKeywords.slice(0, 10),
      recommendedSkills: missingKeywords.slice(0, 5),
      actionableSuggestions,
      bulletPointAnalysis,
      sectionBreakdown,
      analyzedRole: targetRole,
      analyzedAt: new Date().toISOString(),
      source: 'heuristic_engine'
    };
  }
}
