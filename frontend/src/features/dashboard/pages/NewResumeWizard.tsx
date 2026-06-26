import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Sparkles, Loader2, ArrowRight, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useEditorStore } from '../../../shared/hooks/useEditorStore';

type Education = { university: string; degree: string; location: string; startDate: string; endDate: string };
type Experience = { role: string; company: string; location: string; startDate: string; endDate: string; bullets: string[] };
type CustomSection = { title: string; items: { name: string; date: string; bullets: string[] }[] };

export function NewResumeWizard() {
  const navigate = useNavigate();
  const { setCode } = useEditorStore();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Dynamic State
  const [personalInfo, setPersonalInfo] = useState({
    firstName: '', lastName: '', phone: '', email: '', address: '', links: [{ label: '', url: '' }]
  });
  
  const [education, setEducation] = useState<Education[]>([
    { university: '', degree: '', location: '', startDate: '', endDate: '' }
  ]);
  
  const [experience, setExperience] = useState<Experience[]>([
    { role: '', company: '', location: '', startDate: '', endDate: '', bullets: [''] }
  ]);
  
  const [customSections, setCustomSections] = useState<CustomSection[]>([
    { title: 'Projects', items: [{ name: '', date: '', bullets: [''] }] }
  ]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const payload = {
        personalInfo,
        education,
        experience,
        customSections
      };
      
      const response = await fetch(`${import.meta.env.VITE_AI_URL}/api/v1/resume/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form_data: payload })
      });
      
      const data = await response.json();
      
      if (data.tex_code) {
        useEditorStore.getState().resetCode();
        setCode(data.tex_code);
        navigate('/editor');
      } else {
        alert("Failed to generate resume.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while communicating with the AI service.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-full flex flex-col p-8">
      <div className="max-w-4xl w-full mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-blue-400" />
              AI Resume Generator
            </h1>
            <p className="text-white/60">Build unlimited sections and bullet points dynamically.</p>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative overflow-hidden">
          
          {/* Progress Bar */}
          <div className="flex gap-2 mb-8">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${step <= currentStep ? 'bg-blue-500' : 'bg-white/10'}`} />
            ))}
          </div>

          {/* STEP 1: Personal Info */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h2 className="text-2xl font-semibold text-white mb-4">Personal Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">First Name</label>
                  <input value={personalInfo.firstName} onChange={(e) => setPersonalInfo({...personalInfo, firstName: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white placeholder-white/30 focus:border-blue-500 outline-none transition-all" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">Last Name</label>
                  <input value={personalInfo.lastName} onChange={(e) => setPersonalInfo({...personalInfo, lastName: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white placeholder-white/30 focus:border-blue-500 outline-none transition-all" placeholder="Doe" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">Email</label>
                  <input value={personalInfo.email} onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white placeholder-white/30 focus:border-blue-500 outline-none transition-all" placeholder="john@example.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">Phone</label>
                  <input value={personalInfo.phone} onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white placeholder-white/30 focus:border-blue-500 outline-none transition-all" placeholder="+1 (555) 123-4567" />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">Address / Location</label>
                  <input value={personalInfo.address} onChange={(e) => setPersonalInfo({...personalInfo, address: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white placeholder-white/30 focus:border-blue-500 outline-none transition-all" placeholder="City, State / Full Address" />
                </div>
              </div>

              {/* Dynamic Links */}
              <div className="pt-4 border-t border-white/10">
                <div className="flex justify-between items-center mb-4">
                  <label className="text-sm font-medium text-white/70">Professional Links</label>
                  <button onClick={() => setPersonalInfo({...personalInfo, links: [...personalInfo.links, { label: '', url: '' }]})} className="text-xs flex items-center gap-1 text-blue-400 hover:text-blue-300">
                    <Plus className="w-4 h-4" /> Add Link
                  </button>
                </div>
                
                <div className="space-y-3">
                  {personalInfo.links.map((link, idx) => (
                    <div key={idx} className="flex gap-3 relative group">
                      <input 
                        value={link.label} 
                        onChange={(e) => { const newLinks = [...personalInfo.links]; newLinks[idx].label = e.target.value; setPersonalInfo({...personalInfo, links: newLinks}); }} 
                        className="w-1/3 bg-black/40 border border-white/10 rounded-lg p-3 text-white placeholder-white/30 focus:border-blue-500 outline-none transition-all" 
                        placeholder="Label (e.g., YouTube)" 
                      />
                      <input 
                        value={link.url} 
                        onChange={(e) => { const newLinks = [...personalInfo.links]; newLinks[idx].url = e.target.value; setPersonalInfo({...personalInfo, links: newLinks}); }} 
                        className="flex-1 bg-black/40 border border-white/10 rounded-lg p-3 text-white placeholder-white/30 focus:border-blue-500 outline-none transition-all" 
                        placeholder="URL (e.g., youtube.com/@chef)" 
                      />
                      {personalInfo.links.length > 1 && (
                        <button onClick={() => { const newLinks = personalInfo.links.filter((_, i) => i !== idx); setPersonalInfo({...personalInfo, links: newLinks}); }} className="p-3 text-white/30 hover:text-red-400 transition-colors">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Education */}
          {currentStep === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-white">Education</h2>
                <button onClick={() => setEducation([...education, { university: '', degree: '', location: '', startDate: '', endDate: '' }])} className="text-sm flex items-center gap-1 text-blue-400 hover:text-blue-300">
                  <Plus className="w-4 h-4" /> Add Education
                </button>
              </div>
              
              {education.map((edu, idx) => (
                <div key={idx} className="p-5 bg-black/20 rounded-xl border border-white/5 relative group">
                  {education.length > 1 && (
                    <button onClick={() => setEducation(education.filter((_, i) => i !== idx))} className="absolute top-4 right-4 text-white/30 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-white/50">University</label>
                      <input value={edu.university} onChange={(e) => { const newEdu = [...education]; newEdu[idx].university = e.target.value; setEducation(newEdu); }} className="w-full bg-transparent border-b border-white/10 p-2 text-white outline-none focus:border-blue-500" placeholder="Stanford University" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-white/50">Degree</label>
                      <input value={edu.degree} onChange={(e) => { const newEdu = [...education]; newEdu[idx].degree = e.target.value; setEducation(newEdu); }} className="w-full bg-transparent border-b border-white/10 p-2 text-white outline-none focus:border-blue-500" placeholder="BS Computer Science" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-white/50">Location</label>
                      <input value={edu.location} onChange={(e) => { const newEdu = [...education]; newEdu[idx].location = e.target.value; setEducation(newEdu); }} className="w-full bg-transparent border-b border-white/10 p-2 text-white outline-none focus:border-blue-500" placeholder="Stanford, CA" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-white/50">Start Date</label>
                      <input value={edu.startDate} onChange={(e) => { const newEdu = [...education]; newEdu[idx].startDate = e.target.value; setEducation(newEdu); }} className="w-full bg-transparent border-b border-white/10 p-2 text-white outline-none focus:border-blue-500" placeholder="Aug 2018" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-white/50">End Date</label>
                      <input value={edu.endDate} onChange={(e) => { const newEdu = [...education]; newEdu[idx].endDate = e.target.value; setEducation(newEdu); }} className="w-full bg-transparent border-b border-white/10 p-2 text-white outline-none focus:border-blue-500" placeholder="May 2022" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* STEP 3: Experience */}
          {currentStep === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-white">Experience</h2>
                <button onClick={() => setExperience([...experience, { role: '', company: '', location: '', startDate: '', endDate: '', bullets: [''] }])} className="text-sm flex items-center gap-1 text-blue-400 hover:text-blue-300">
                  <Plus className="w-4 h-4" /> Add Experience
                </button>
              </div>
              
              {experience.map((exp, expIdx) => (
                <div key={expIdx} className="p-5 bg-black/20 rounded-xl border border-white/5 relative group">
                  {experience.length > 1 && (
                    <button onClick={() => setExperience(experience.filter((_, i) => i !== expIdx))} className="absolute top-4 right-4 text-white/30 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-white/50">Role</label>
                      <input value={exp.role} onChange={(e) => { const newExp = [...experience]; newExp[expIdx].role = e.target.value; setExperience(newExp); }} className="w-full bg-transparent border-b border-white/10 p-2 text-white outline-none focus:border-blue-500" placeholder="Software Engineer" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-white/50">Company</label>
                      <input value={exp.company} onChange={(e) => { const newExp = [...experience]; newExp[expIdx].company = e.target.value; setExperience(newExp); }} className="w-full bg-transparent border-b border-white/10 p-2 text-white outline-none focus:border-blue-500" placeholder="Google" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-white/50">Location</label>
                      <input value={exp.location} onChange={(e) => { const newExp = [...experience]; newExp[expIdx].location = e.target.value; setExperience(newExp); }} className="w-full bg-transparent border-b border-white/10 p-2 text-white outline-none focus:border-blue-500" placeholder="Mountain View, CA" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-white/50">Start Date</label>
                      <input value={exp.startDate} onChange={(e) => { const newExp = [...experience]; newExp[expIdx].startDate = e.target.value; setExperience(newExp); }} className="w-full bg-transparent border-b border-white/10 p-2 text-white outline-none focus:border-blue-500" placeholder="Jun 2022" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-white/50">End Date</label>
                      <input value={exp.endDate} onChange={(e) => { const newExp = [...experience]; newExp[expIdx].endDate = e.target.value; setExperience(newExp); }} className="w-full bg-transparent border-b border-white/10 p-2 text-white outline-none focus:border-blue-500" placeholder="Present" />
                    </div>
                  </div>
                  
                  {/* Bullets */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-medium text-white/50">Bullet Points</label>
                      <button onClick={() => { const newExp = [...experience]; newExp[expIdx].bullets.push(''); setExperience(newExp); }} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                        <Plus className="w-3 h-3" /> Add Bullet
                      </button>
                    </div>
                    {exp.bullets.map((bullet, bulletIdx) => (
                      <div key={bulletIdx} className="flex gap-2">
                        <input value={bullet} onChange={(e) => { const newExp = [...experience]; newExp[expIdx].bullets[bulletIdx] = e.target.value; setExperience(newExp); }} className="flex-1 bg-black/40 border border-white/5 rounded-lg p-2 text-sm text-white outline-none focus:border-blue-500" placeholder="Developed a scalable microservice..." />
                        {exp.bullets.length > 1 && (
                          <button onClick={() => { const newExp = [...experience]; newExp[expIdx].bullets = newExp[expIdx].bullets.filter((_, i) => i !== bulletIdx); setExperience(newExp); }} className="p-2 text-white/30 hover:text-red-400">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* STEP 4: Custom Sections */}
          {currentStep === 4 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-2xl font-semibold text-white">Custom Sections</h2>
                  <p className="text-sm text-white/50 mt-1">Add flexible sections like Projects, Certifications, or Hobbies.</p>
                </div>
                <button onClick={() => setCustomSections([...customSections, { title: 'New Section', items: [{ name: '', date: '', bullets: [''] }] }])} className="text-sm flex items-center gap-1 text-blue-400 hover:text-blue-300 bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20">
                  <Plus className="w-4 h-4" /> Add Section
                </button>
              </div>
              
              {customSections.map((section, secIdx) => (
                <div key={secIdx} className="p-6 bg-black/30 rounded-2xl border border-white/10 relative shadow-xl">
                  {/* Section Header */}
                  <div className="flex gap-4 items-end mb-6 pb-4 border-b border-white/5">
                    <div className="flex-1 space-y-1">
                      <label className="text-xs font-bold text-blue-400 uppercase tracking-wider">Section Title</label>
                      <input 
                        value={section.title} 
                        onChange={(e) => { const newSecs = [...customSections]; newSecs[secIdx].title = e.target.value; setCustomSections(newSecs); }} 
                        className="w-full bg-transparent text-xl font-bold text-white outline-none focus:border-b border-blue-500 transition-all placeholder-white/20" 
                        placeholder="E.g., Projects, Honors, Hobbies" 
                      />
                    </div>
                    <button onClick={() => setCustomSections(customSections.filter((_, i) => i !== secIdx))} className="p-2 text-white/30 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Section Items */}
                  <div className="space-y-6">
                    {section.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="p-4 bg-white/5 rounded-xl border border-white/5 relative group">
                        {section.items.length > 1 && (
                          <button onClick={() => { const newSecs = [...customSections]; newSecs[secIdx].items = newSecs[secIdx].items.filter((_, i) => i !== itemIdx); setCustomSections(newSecs); }} className="absolute top-4 right-4 text-white/30 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-white/50">Item Name</label>
                            <input value={item.name} onChange={(e) => { const newSecs = [...customSections]; newSecs[secIdx].items[itemIdx].name = e.target.value; setCustomSections(newSecs); }} className="w-full bg-transparent border-b border-white/10 p-2 text-white outline-none focus:border-blue-500" placeholder="E-Commerce App" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-white/50">Date / Info (Optional)</label>
                            <input value={item.date} onChange={(e) => { const newSecs = [...customSections]; newSecs[secIdx].items[itemIdx].date = e.target.value; setCustomSections(newSecs); }} className="w-full bg-transparent border-b border-white/10 p-2 text-white outline-none focus:border-blue-500" placeholder="Jan 2023 - Present" />
                          </div>
                        </div>
                        
                        {/* Item Bullets */}
                        <div className="space-y-2 mt-4">
                          <div className="flex justify-between items-center">
                            <label className="text-xs font-medium text-white/50">Bullet Points</label>
                            <button onClick={() => { const newSecs = [...customSections]; newSecs[secIdx].items[itemIdx].bullets.push(''); setCustomSections(newSecs); }} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                              <Plus className="w-3 h-3" /> Add Bullet
                            </button>
                          </div>
                          {item.bullets.map((bullet, bulletIdx) => (
                            <div key={bulletIdx} className="flex gap-2">
                              <input value={bullet} onChange={(e) => { const newSecs = [...customSections]; newSecs[secIdx].items[itemIdx].bullets[bulletIdx] = e.target.value; setCustomSections(newSecs); }} className="flex-1 bg-black/40 border border-white/5 rounded-lg p-2 text-sm text-white outline-none focus:border-blue-500" placeholder="Describe what you did..." />
                              <button onClick={() => { const newSecs = [...customSections]; newSecs[secIdx].items[itemIdx].bullets = newSecs[secIdx].items[itemIdx].bullets.filter((_, i) => i !== bulletIdx); setCustomSections(newSecs); }} className="p-2 text-white/30 hover:text-red-400">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    
                    <button onClick={() => { const newSecs = [...customSections]; newSecs[secIdx].items.push({ name: '', date: '', bullets: [''] }); setCustomSections(newSecs); }} className="w-full py-3 border border-dashed border-white/20 rounded-xl text-white/50 hover:text-white hover:border-white/50 hover:bg-white/5 transition-all text-sm font-medium flex items-center justify-center gap-2">
                      <Plus className="w-4 h-4" /> Add Item to {section.title || 'Section'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-12 flex items-center justify-between pt-6 border-t border-white/10">
            <button
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              disabled={currentStep === 1 || isGenerating}
              className={`flex items-center gap-2 px-6 py-3 font-medium rounded-xl transition-colors ${currentStep === 1 ? 'opacity-0 pointer-events-none' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            
            {currentStep < 4 ? (
              <button
                onClick={() => setCurrentStep(prev => Math.min(4, prev + 1))}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-all hover:scale-105 shadow-lg shadow-blue-500/20"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="flex items-center gap-2 px-8 py-3 bg-white text-black hover:bg-white/90 font-semibold rounded-xl transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)] disabled:opacity-70 disabled:pointer-events-none disabled:hover:scale-100"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating Magic...
                  </>
                ) : (
                  <>
                    <Bot className="w-5 h-5" />
                    Generate Resume
                  </>
                )}
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
