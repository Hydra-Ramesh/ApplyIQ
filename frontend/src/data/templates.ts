export const resumeTemplates = [
  {
    id: "classic-professional",
    name: "Classic Professional",
    description: "A clean, standard layout perfect for corporate roles and ATS tracking.",
    latex: `\\documentclass[letterpaper,11pt]{article}
\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\pagestyle{fancy}
\\fancyhf{}
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}
\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}
\\urlstyle{same}
\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}
\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]
\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}
\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}
\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & #2 \\\\
    \\end{tabular*}\\vspace{-7pt}
}
\\newcommand{\\resumeSubItem}[1]{\\resumeItem{#1}\\vspace{-4pt}}
\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}
\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}
\\begin{document}

\\begin{center}
    \\textbf{\\Huge \\scshape John Doe} \\\\ \\vspace{1pt}
    \\small 123-456-7890 $|$ \\href{mailto:x@x.com}{\\underline{johndoe@email.com}} $|$ 
    \\href{https://linkedin.com/in/...}{\\underline{linkedin.com/in/johndoe}} $|$
    \\href{https://github.com/...}{\\underline{github.com/johndoe}}
\\end{center}

\\section{Education}
  \\resumeSubHeadingListStart
    \\resumeSubheading
      {University Name}{Aug. 2018 -- May 2022}
      {Bachelor of Science in Computer Science}{City, State}
  \\resumeSubHeadingListEnd

\\section{Experience}
  \\resumeSubHeadingListStart
    \\resumeSubheading
      {Software Engineer}{June 2022 -- Present}
      {Tech Company}{City, State}
      \\resumeItemListStart
        \\resumeItem{Developed a scalable web application using React and Node.js.}
        \\resumeItem{Improved database query performance by 40\\%.}
      \\resumeItemListEnd
  \\resumeSubHeadingListEnd

\\section{Projects}
  \\resumeSubHeadingListStart
    \\resumeProjectHeading
      {\\textbf{Portfolio Website} $|$ \\emph{React, Tailwind CSS}}{June 2023}
      \\resumeItemListStart
        \\resumeItem{Designed and developed a responsive portfolio website to showcase projects.}
      \\resumeItemListEnd
  \\resumeSubHeadingListEnd

\\end{document}
`
  },
  {
    id: "minimalist",
    name: "Minimalist",
    description: "A stripped-down, elegant design focusing entirely on content.",
    latex: `\\documentclass[letterpaper,11pt]{article}
\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\pagestyle{fancy}
\\fancyhf{}
\\renewcommand{\\headrulewidth}{0pt}
\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}
\\raggedbottom
\\raggedright
\\titleformat{\\section}{
  \\vspace{2pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]
\\newcommand{\\resumeItem}[1]{\\item\\small{{#1 \\vspace{-2pt}}}}
\\begin{document}

\\begin{center}
    \\textbf{\\Huge \\scshape Jane Smith} \\\\ \\vspace{1pt}
    \\small 987-654-3210 $|$ janesmith@email.com
\\end{center}

\\section{Education}
\\textbf{University of Example} \\hfill Aug 2019 -- May 2023\\\\
B.A. in Graphic Design

\\section{Experience}
\\textbf{Creative Agency} \\hfill June 2023 -- Present\\\\
\\textit{Junior Designer}
\\begin{itemize}[leftmargin=0.15in, label={--}]
  \\resumeItem{Redesigned 5 client websites resulting in a 20\\% increase in engagement.}
\\end{itemize}

\\end{document}`
  }
];
