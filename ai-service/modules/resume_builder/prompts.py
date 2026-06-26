from langchain_core.prompts import PromptTemplate

REWRITE_BULLET_PROMPT = PromptTemplate.from_template(
    "You are an expert resume writer. "
    "Take the following raw work experience description and rewrite it into a single, "
    "powerful, action-oriented resume bullet point. "
    "Focus on impact and metrics if possible.\n\n"
    "Raw text: {raw_text}\n\n"
    "Rewritten bullet:"
)

OPTIMIZE_ATS_PROMPT = PromptTemplate.from_template(
    "You are an expert ATS (Applicant Tracking System) optimizer. "
    "Analyze the given resume against the job description. "
    "Provide a score from 0-100, list missing keywords, and suggest improvements.\n"
    "CRITICAL: You MUST output the numerical score wrapped in <score> and </score> tags at the very beginning of your response. For example: <score>85</score>.\n\n"
    "Job Description:\n{job_description}\n\n"
    "Resume:\n{resume_text}\n\n"
    "Analysis:"
)

TAILOR_RESUME_PROMPT = PromptTemplate.from_template(
    "You are an elite career coach and LaTeX expert. "
    "I will provide you with a full LaTeX resume and a target Job Description. "
    "Your task is to REWRITE the bullet points in the LaTeX code so that they naturally integrate "
    "the required keywords and skills from the Job Description. "
    "DO NOT hallucinate experience I do not have. Merely reframe my existing experience. "
    "RETURN ONLY THE VALID COMPILED LATEX CODE. DO NOT ADD ANY MARKDOWN BACKTICKS OR EXPLANATIONS. "
    "RETURN RAW TEXT ONLY.\n\n"
    "Job Description:\n{job_description}\n\n"
    "Original LaTeX:\n{tex_code}\n\n"
    "Tailored LaTeX:"
)

AUTOCOMPLETE_PROMPT = PromptTemplate.from_template(
    "You are an AI Copilot for a resume builder. "
    "The user is typing a bullet point for their resume. "
    "Based on the prefix they just typed and the context of their entire resume, "
    "predict the logical conclusion of the sentence. "
    "RETURN ONLY THE PREDICTED COMPLETION TEXT. DO NOT repeat the prefix. "
    "DO NOT return markdown, quotes, or conversational text. Maximum 15 words.\n\n"
    "Context (Rest of Resume):\n{context}\n\n"
    "User Prefix Typed So Far:\n{prefix}\n\n"
    "Completion:"
)

ROAST_PROMPT = PromptTemplate.from_template(
    "You are a brutally honest, savage, but ultimately helpful FAANG Senior Technical Recruiter. "
    "A candidate has just handed you their resume content (which happens to be formatted in LaTeX). "
    "CRITICAL RULE: IGNORE THE LATEX SYNTAX COMPLETELY. DO NOT complain about LaTeX, packages, or code formatting. "
    "Your job is to absolutely ROAST the ACTUAL CONTENT of their resume. Tear apart their cliches, their buzzwords, "
    "their lack of metrics, and any weak bullet points. "
    "Be funny, sarcastic, and ruthless. "
    "HOWEVER, you must also recognize and appreciate genuine achievements. If they have a high CGPA, strong education, "
    "extraordinary coding achievements, or impressive projects, make sure to explicitly discuss and praise them amidst the roast. "
    "At the very end, drop the act and provide 3 genuinely good, actionable bullet points "
    "on how they can fix their content. "
    "Format your response in Markdown. Use emojis. \n\n"
    "Resume Content:\n{tex_code}\n\n"
    "Your Savage Roast:"
)

COLD_EMAIL_PROMPT = PromptTemplate.from_template(
    "You are an elite career networking strategist. "
    "A candidate wants to send a cold email to a Hiring Manager to bypass the standard application portal. "
    "I will provide the candidate's resume and the Hiring Manager's info/job description. "
    "Draft a highly personalized, confident, and concise cold email. "
    "CRITICAL RULE: The email MUST be exactly 3 to 4 sentences long. Do not write a long email. "
    "It must have a clear, low-friction Call to Action (e.g., a 10-minute chat). "
    "Output ONLY the Subject Line and the Email Body.\n\n"
    "Candidate Resume:\n{tex_code}\n\n"
    "Hiring Manager Info:\n{target_info}\n\n"
    "Cold Email Draft:"
)

LATEX_PREAMBLE = r"""
\documentclass[letterpaper,11pt]{article}

\usepackage{latexsym}
\usepackage[empty]{fullpage}
\usepackage{titlesec}
\usepackage{marvosym}
\usepackage[usenames,dvipsnames]{color}
\usepackage{verbatim}
\usepackage{enumitem}
\usepackage[hidelinks]{hyperref}
\usepackage[english]{babel}
\usepackage{tabularx}
\usepackage{fontawesome5}
\usepackage{multicol}
\usepackage{graphicx}
\setlength{\multicolsep}{-3.0pt}
\setlength{\columnsep}{-1pt}

\RequirePackage{tikz}
\RequirePackage{xcolor}
\usepackage{tikz}
\usetikzlibrary{svg.path}

\definecolor{cvblue}{HTML}{0E5484}
\definecolor{black}{HTML}{130810}
\definecolor{darkcolor}{HTML}{0F4539}
\definecolor{cvgreen}{HTML}{3BD80D}
\definecolor{taggreen}{HTML}{00E278}
\definecolor{SlateGrey}{HTML}{2E2E2E}
\definecolor{LightGrey}{HTML}{666666}
\colorlet{name}{black}
\colorlet{tagline}{darkcolor}
\colorlet{heading}{darkcolor}
\colorlet{headingrule}{cvblue}
\colorlet{accent}{darkcolor}
\colorlet{emphasis}{SlateGrey}
\colorlet{body}{LightGrey}

\addtolength{\oddsidemargin}{-0.6in}
\addtolength{\evensidemargin}{-0.5in}
\addtolength{\textwidth}{1.19in}
\addtolength{\topmargin}{-.7in}
\addtolength{\textheight}{1.4in}

\urlstyle{same}

\raggedbottom
\raggedright
\setlength{\tabcolsep}{0in}

\titleformat{\section}{
  \vspace{-4pt}\scshape\raggedright\large\bfseries
}{}{0em}{}[\color{black}\titlerule \vspace{-5pt}]

\pdfgentounicode=1

\newcommand{\resumeItem}[1]{
  \item\small{
    {#1 \vspace{-2pt}}
  }
}

\newcommand{\classesList}[4]{
    \item\small{
        {#1 #2 #3 #4 \vspace{-2pt}}
  }
}

\newcommand{\resumeSubheading}[4]{
  \vspace{-2pt}\item
    \begin{tabular*}{1.0\textwidth}[t]{l@{\extracolsep{\fill}}r}
      \textbf{\large#1} & \textbf{\small #2} \\
      \textit{\large#3} & \textit{\small #4} \\
    \end{tabular*}\vspace{-7pt}
}

\newcommand{\resumeSubSubheading}[2]{
    \item
    \begin{tabular*}{0.97\textwidth}{l@{\extracolsep{\fill}}r}
      \textit{\small#1} & \textit{\small #2} \\
    \end{tabular*}\vspace{-7pt}
}

\newcommand{\resumeProjectHeading}[2]{
    \item
    \begin{tabular*}{1.001\textwidth}{l@{\extracolsep{\fill}}r}
      \small#1 & \textbf{\small #2}\\
    \end{tabular*}\vspace{-7pt}
}

\newcommand{\resumeSubItem}[1]{\resumeItem{#1}\vspace{-4pt}}

\renewcommand\labelitemi{$\vcenter{\hbox{\tiny$\bullet$}}$}
\renewcommand\labelitemii{$\vcenter{\hbox{\tiny$\bullet$}}$}

\newcommand{\resumeSubHeadingListStart}{\begin{itemize}[leftmargin=0.0in, label={}]}
\newcommand{\resumeSubHeadingListEnd}{\end{itemize}}
\newcommand{\resumeItemListStart}{\begin{itemize}}
\newcommand{\resumeItemListEnd}{\end{itemize}\vspace{-5pt}}

\newcommand\sbullet[1][.5]{\mathbin{\vcenter{\hbox{\scalebox{#1}{$\bullet$}}}}}

\begin{document}
"""

LATEX_PREAMBLE_ESCAPED = LATEX_PREAMBLE.replace("{", "{{").replace("}", "}}")

GENERATE_RESUME_PROMPT = PromptTemplate.from_template(
    "You are an elite LaTeX resume generator. "
    "I will provide you with a JSON object containing a user's personal information, "
    "arrays for education and work experience, and a 'customSections' array for everything else. "
    "Your task is to populate the provided LaTeX template format dynamically. "
    "For all arrays, iterate through EVERY item in the JSON array "
    "and create the corresponding LaTeX macro block. "
    "If an array is empty, OMIT that entire section from the LaTeX. "
    "DO NOT hallucinate any information. Use ONLY the data provided in the JSON. "
    "RETURN ONLY THE COMPILED LATEX CODE. DO NOT ADD ANY MARKDOWN BACKTICKS, EXPLANATIONS, OR PREAMBLES. "
    "RETURN RAW TEXT ONLY.\n\n"
    "--- LATEX TEMPLATE PREAMBLE AND MACROS (USE EXACTLY THIS) ---\n"
    + LATEX_PREAMBLE_ESCAPED + "\n"
    "--- INSTRUCTIONS FOR GENERATING CONTENT ---\n"
    "1. Header: Use the personalInfo object to construct the center block. Begin with a \\begin{{center}} block. Name (Huge/scshape), then a new line for Address. Then a new line for Phone, Email, and links separated by ` ~ `. For each link, if an icon URL is available, format it like \\href{{URL}}{{\\raisebox{{-0.2\\height}}{{\\includegraphics[height=0.3cm, width=0.3cm]{{ICON_FILENAME}}}}\\ \\underline{{LABEL}}}}. If no icon, use \\underline{{LABEL}}.\n"
    "2. Education: Use \\section{{EDUCATION}} followed by \\resumeSubHeadingListStart. For each item in the education array, use \\resumeSubheading{{University}}{{Dates}}{{Degree}}{{Location}}.\n"
    "3. Experience: Use \\section{{EXPERIENCE}}. For each job, use \\resumeSubheading{{Role}}{{Dates}}{{Company}}{{Location}}. Then use \\resumeItemListStart and \\resumeItem{{\\normalsize{{bullet point text}}}} for EACH bullet point string in the array. DO NOT add `\\\\` at the end of `\\resumeItem`. If a bullet point is empty, DO NOT generate a `\\resumeItem` for it.\n"
    "4. Custom Sections: For each object in the 'customSections' array, generate \\section{{TITLE_HERE}}. Then use \\resumeSubHeadingListStart. For each item inside the section, use \\resumeProjectHeading{{\\href{{#}}{{\\textbf{{\\large{{\\underline{{NAME_HERE}}}}}}}} $|$ \\large{{\\underline{{LOCATION/TECH}}}}}}{{DATE_HERE}}. If there are bullet points, use \\resumeItemListStart and \\resumeItem{{\\normalsize{{bullet point text}}}} for EACH bullet point string. DO NOT add `\\\\` at the end of `\\resumeItem`.\n"
    "5. Technical Skills: Use \\section{{TECHNICAL SKILLS}} and \\begin{{itemize}}[leftmargin=0.15in, label={{}}] followed by \\small{{\\item{{ \\textbf{{\\normalsize{{Category:}}}}{{  \\normalsize{{Skills}} }} }} }}.\n"
    "End the document with \\end{{document}}.\n\n"
    "USER DATA (JSON):\n{form_data}\n\n"
    "GENERATED LATEX:"
)

COPILOT_PROMPT = PromptTemplate.from_template(
    "You are an elite LaTeX expert acting as an AI Copilot for a resume editor.\n"
    "The user has provided their current LaTeX resume code, and a natural language prompt with instructions on how to modify it.\n"
    "Your job is to apply the requested changes perfectly, ensuring the LaTeX remains valid and compiles successfully.\n"
    "DO NOT hallucinate changes the user did not ask for.\n"
    "You must return your response using exactly these two XML tags:\n"
    "<message>\n"
    "A short, friendly, and human-like response confirming the change or addressing the user's message (e.g. 'Hello! I have updated your font size.').\n"
    "</message>\n"
    "<tex_code>\n"
    "The fully updated, valid LaTeX code here. Write it exactly as you would in a normal .tex file. You do not need to double-escape backslashes for JSON.\n"
    "</tex_code>\n\n"
    "PAST CONVERSATION HISTORY:\n{history}\n\n"
    "USER INSTRUCTION: {instruction}\n\n"
    "CURRENT LATEX CODE:\n{tex_code}\n\n"
    "YOUR RESPONSE:"
)

