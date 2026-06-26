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
,
  {
    id: "aman-professional",
    name: "Aman's Professional Template",
    description: "A customized dense format template with support for local icons and profile photos.",
    latex: `\\documentclass[letterpaper,11pt]{article}
\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\usepackage{fontawesome5}
\\usepackage{multicol}
\\usepackage{graphicx}
\\setlength{\\multicolsep}{-3.0pt}
\\setlength{\\columnsep}{-1pt}

\\RequirePackage{tikz}
\\usetikzlibrary{svg.path}

\\definecolor{cvblue}{HTML}{0E5484}
\\definecolor{black}{HTML}{130810}
\\definecolor{darkcolor}{HTML}{0F4539}
\\definecolor{cvgreen}{HTML}{3BD80D}
\\definecolor{taggreen}{HTML}{00E278}
\\definecolor{SlateGrey}{HTML}{2E2E2E}
\\definecolor{LightGrey}{HTML}{666666}
\\colorlet{name}{black}
\\colorlet{tagline}{darkcolor}
\\colorlet{heading}{darkcolor}
\\colorlet{headingrule}{cvblue}
\\colorlet{accent}{darkcolor}
\\colorlet{emphasis}{SlateGrey}
\\colorlet{body}{LightGrey}

\\addtolength{\\oddsidemargin}{-0.6in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1.19in}
\\addtolength{\\topmargin}{-.7in}
\\addtolength{\\textheight}{1.4in}

\\urlstyle{same}
\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large\\bfseries
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{1.0\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{\\large#1} & \\textbf{\\small #2} \\\\
      \\textit{\\large#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{1.001\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & \\textbf{\\small #2}\\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubItem}[1]{\\resumeItem{#1}\\vspace{-4pt}}

\\renewcommand\\labelitemi{\$\\vcenter{\\hbox{\\tiny\$\\bullet\$}}\$}
\\renewcommand\\labelitemii{\$\\vcenter{\\hbox{\\tiny\$\\bullet\$}}\$}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.0in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

\\newcommand\\sbullet[1][.5]{\\mathbin{\\vcenter{\\hbox{\\scalebox{#1}{\$\\bullet\$}}}}}

\\begin{document}

\\begin{center}
    % Upload a photo named "profile.jpg" in the Icon Manager to use it here!
    \\IfFileExists{profile.jpg}{\includegraphics[width=2.5cm, height=2.5cm, keepaspectratio]{profile.jpg}}{} \\\\ \\vspace{5pt}
    {\\Huge \\scshape Aman Babu} \\\\ \\vspace{1pt}
    Uttam Nagar, Delhi \\\\ \\vspace{1pt}
    \\small \\href{tel:#}{ \\raisebox{-0.1\\height}\\faPhone\\ \\underline{+91-6396267480} ~} \\href{mailto:yourname@gmail.com}{\\raisebox{-0.2\\height}\\faEnvelope\\  \\underline{babu.a@samsung.com}} ~ 
    \\href{https://linkedin.com/in/amanbabu23}{\\raisebox{-0.2\\height}\\faLinkedin\\ \\underline{Linkedin}}  ~
    \\href{https://github.com/aman-spp}{\\raisebox{-0.2\\height}\\faGithub\\ \\underline{Github}} ~
    \\href{https://codeforces.com/profile/alwaysAnewbie}{\\raisebox{-0.2\\height}\\faCode\\ \\underline{Codeforces}} ~
    \\vspace{-8pt}
    \\href{https://leetcode.com/aman_2_0_2_3/}{\\raisebox{-0.2\\height}\\faLaptop\\ \\underline{LeetCode}} ~
    \\vspace{-8pt}
    \\href{https://auth.geeksforgeeks.org/user/aman_2_0_2_3/practice}{\\raisebox{-0.2\\height}\\faTerminal\\ \\underline{GeeksforGeeks}} ~
\\end{center}
 \\vspace{0.5mm}

\\section{EDUCATION}
  \\resumeSubHeadingListStart
    \\resumeSubheading
      {PDPM, Indian Institute of Information Technology, Jabalpur}{2019 -- 2023}
      {B.Tech - Computer Science and Engineering - \\textbf{CGPA} - \\textbf{7.9}}{Jabalpur, Madhya Pradesh}
  \\resumeSubHeadingListEnd

\\section{EXPERIENCE}
  \\resumeSubHeadingListStart
    \\resumeSubheading
      {Senior Executive at Samsung SDS}{December 2024 - January 2025} 
      {\\underline{Role - RPA Developer}}{Gurugram, Haryana}
      \\resumeItemListStart
        \\resumeItem{\\normalsize{Developed RPA solutions and gained hands-on experience with Brity RPA Designer and Brity Orchestrator.}}
        \\resumeItem{\\normalsize{Automated processes to improve efficiency and reduce manual effort.}}
        \\resumeItem{\\normalsize{Attended training sessions on \\textbf{Python and Databases.}}}
      \\resumeItemListEnd  
  \\resumeSubHeadingListEnd
\\vspace{-12pt}

\\resumeSubHeadingListStart
    \\resumeSubheading
      {Intern at Samsung SDS}{March 2023 - June 2023} 
      {\\underline{Role - Software Developer}}{Gurugram, Haryana}
      \\resumeItemListStart
        \\resumeItem{\\normalsize{Learned and Implemented\\textbf{Advanced Data Structure and Algorithms, Graph, Segment Tree, DP.}}}
        \\resumeItem{\\normalsize{Working on various projects using various coding methodologies.}}
        \\resumeItem{\\normalsize{Successfully cleared the \\textbf{Samsung Advanced Software Test} during my internship.}}
        \\resumeItem{\\normalsize{Implemented user authentication, search functionality, and a voting system for ranking answers.}}
        \\resumeItem{\\normalsize{Handle the Database and created a responsive front-end using \\textbf{HTML, CSS and JavaScript.}}}
      \\resumeItemListEnd  
  \\resumeSubHeadingListEnd
\\vspace{-12pt}

\\section{PROJECTS}
    \\vspace{-5pt}
    \\resumeSubHeadingListStart
     \\resumeProjectHeading
          {\\href{\#}{\\textbf{\\large{\\underline{File Handling Using Brity RPA}}}} \$|\$ \\large{\\underline{Brity RPA Designer, JavaScript, Excel}}}{Jan 2025}\\\\
          \\resumeItemListStart
            \\resumeItem {\\normalsize{Developed an RPA solution to extract all files from a specified folder in the local machine and log the file extensions into an Excel sheet using a For Each loop.}}
            \\resumeItem{\\normalsize{This automation made inventory tracking easier by categorizing files based on their extensions.}}
          \\resumeItemListEnd 
          \\vspace{-13pt}
          
     \\resumeProjectHeading
          {\\href{\#}{\\textbf{\\large{\\underline{Brity RPA Automation - Knox Password Update.}}}} \$|\$ \\large{\\underline{Brity RPA Designer, JavaScript}}}{Jan 2025}\\\\
          \\resumeItemListStart
            \\resumeItem {\\normalsize{Automated the process of changing the Knox password using Brity RPA, enhancing security and efficiency.}}
            \\resumeItem{\\normalsize{Open Browser: Launched the web browser and navigated to the Knox portal.}}
            \\resumeItem{\\normalsize{Knox Login: Automated Knox login}}
            \\resumeItem{\\normalsize{Send Confirmation Email: Notified the user via email upon successful password update.}}
          \\resumeItemListEnd 
          \\vspace{-13pt}
          
    \\resumeProjectHeading
          {\\href{https://github.com/aman-spp/Scaler-task/tree/main/Scaler-Task-main}{\\textbf{\\large{\\underline{Interview Creation Portal }}}} \$|\$ \\large{\\underline{React, JavaScript, Database}}}{2024}\\\\
          \\resumeItemListStart
            \\resumeItem {\\normalsize {An interview page where the admin can create an interview by selecting participants, start and end time.}}
            \\resumeItem{\\normalsize{Implemented an interviews list page where admin can see all the upcoming interviews.}}
            \\resumeItem{\\normalsize{An interview edit page where admin can edit the created interview with the same validations as on the creation page.}}
          \\resumeItemListEnd 
          \\vspace{-13pt}
          
      \\resumeProjectHeading
          {\\href{https://github.com/FusionIIIT/Fusion/tree/main/FusionIIIT/applications/counselling_cell}{\\textbf{\\large{\\underline{Counselling Cell - \\textbf{Fusion IIIT}}}}} \$|\$ \\large{\\underline{HTML, CSS, React, PostgreSQL}}}{2022-2023}\\\\
          \\resumeItemListStart
             \\resumeItem{\\normalsize{Develop the \\textbf{front-end} of Counselling Cell module in Fusion IIIT.}}
            \\resumeItem{\\normalsize{Module Consists of 4-5 different types of users with different functionalities.}}
            \\resumeItem{\\normalsize{Added \\textbf{10-12 new features} like organize the user interface of the Module's \\textbf{Home Page}}}
            \\resumeItem{\\normalsize{Handle the database and integrated the module with other existing modules.}}
          \\resumeItemListEnd
          \\vspace{-7pt}
    \\resumeSubHeadingListEnd

\\section{TECHNICAL SKILLS}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
     \\textbf{\\normalsize{Languages:}}{  \\normalsize{Python, C++, JavaScript, VBScript, SQL}} \\\\
     \\textbf{\\normalsize{Technologies/Frameworks:}}{  \\normalsize{HTML5, CSS3, React, MongoDB, Express, Javascript, Bootstrap}} \\\\
     \\textbf{\\normalsize{Developer Tools:}}{  \\normalsize{Brity RPA Designer, Brity RPA Orchestrator, VS Code, PyCharm, IntelliJ, Canva }} \\\\
    }}
 \\end{itemize}
 \\vspace{-15pt}

\\section{CERTIFICATIONS}
\$\\sbullet[.75] \\hspace{0.1cm}\$ {\\href{https://www.udemy.com/certificate/UC-c0e8dc21-8e8b-4f6e-9d05-5d109a9523cd/}{Mastering Data Structure and Algorithms - Udemy}} \\hspace{2.59cm}\\\\
\$\\sbullet[.75] \\hspace{0.1cm}\$ {\\href{https://www.udemy.com/certificate/UC-b732c216-80d9-448c-b5fd-42b4aa7ca0ee/}{C++ - Udemy}} \\hspace{1.6cm}\\\\
\$\\sbullet[.75] \\hspace{0.2cm}\${\\href{certificateLink.com}{Graph data structure for CP - Udemy}} \\hspace{1cm}\\\\

 \\section{EXTRACURRICULAR}
    \\resumeSubHeadingListStart
            \\resumeItemListStart
                \\resumeItem{\\normalsize{Taught basic C++/DSA in offline Mode.          05-2021 -- 12-2021}}
                \\resumeItem{\\normalsize{NSS Member from 2019 to 2022 }}
            \\resumeItemListEnd
    \\resumeSubHeadingListEnd
 \\vspace{-11pt}
 
 \\end{document}`
  }
];
