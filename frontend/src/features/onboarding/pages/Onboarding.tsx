import { useNavigate } from 'react-router-dom';
import { useOnboardingStore } from '../../../store/useOnboardingStore';

export function Onboarding() {
  const { currentStep, nextStep, prevStep, personalInfo, updatePersonalInfo, codingProfiles, updateCodingProfiles } = useOnboardingStore();
  const navigate = useNavigate();

  const handleFinish = async () => {
    // In a real app, send data to backend here.
    console.log("Submitting Profile:", { personalInfo, codingProfiles });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
        
        {/* Progress Bar */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className={`h-2 flex-1 rounded-full ${step <= currentStep ? 'bg-blue-600' : 'bg-slate-100'}`} />
          ))}
        </div>

        {/* Step 1: Personal Info */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div>
              <h2 className="text-2xl font-bold">Let's get to know you</h2>
              <p className="text-slate-500">This basic info will be used in all your resumes.</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">First Name</label>
                <input 
                  className="w-full p-2 border rounded-md" 
                  value={personalInfo.firstName}
                  onChange={(e) => updatePersonalInfo({ firstName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Last Name</label>
                <input 
                  className="w-full p-2 border rounded-md" 
                  value={personalInfo.lastName}
                  onChange={(e) => updatePersonalInfo({ lastName: e.target.value })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <input 
                className="w-full p-2 border rounded-md" 
                value={personalInfo.location}
                onChange={(e) => updatePersonalInfo({ location: e.target.value })}
              />
            </div>
          </div>
        )}

        {/* Step 2: Coding Profiles */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div>
              <h2 className="text-2xl font-bold">Coding Profiles</h2>
              <p className="text-slate-500">We'll fetch your stats to boost your resume.</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">GitHub Username</label>
                <input 
                  className="w-full p-2 border rounded-md" 
                  value={codingProfiles.github}
                  onChange={(e) => updateCodingProfiles({ github: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">LeetCode Username</label>
                <input 
                  className="w-full p-2 border rounded-md" 
                  value={codingProfiles.leetcode}
                  onChange={(e) => updateCodingProfiles({ leetcode: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}

        {/* Steps 3 & 4 (Placeholders for Experience/Education/Projects) */}
        {currentStep > 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div>
              <h2 className="text-2xl font-bold">
                {currentStep === 3 ? "Experience & Education" : "Projects"}
              </h2>
              <p className="text-slate-500">You can add these later from your dashboard!</p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t">
          <button 
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-4 py-2 font-medium text-slate-600 hover:text-slate-900 disabled:opacity-50"
          >
            Back
          </button>
          
          <button 
            onClick={currentStep === 4 ? handleFinish : nextStep}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            {currentStep === 4 ? "Finish" : "Continue"}
          </button>
        </div>

      </div>
    </div>
  );
}
