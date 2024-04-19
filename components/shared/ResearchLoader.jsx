import { useEffect, useState } from 'react';
import Tick from "@/public/assets/tick.png";
import Flicker from "@/public/assets/flicker.gif";
import Image from "next/image";

const steps = [
  "Searching the internet",
  "Summarizing Information",
];

const flickerDuration = 500;
const totalDuration = 10000; 
const stepDuration = totalDuration / steps.length; 

const ResearchLoader = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [allStepsCompleted, setAllStepsCompleted] = useState(false);
    const [loadingComplete, setLoadingComplete] = useState(false);


  useEffect(() => {
    const intervalId = setInterval(() => {
      if (currentStep === steps.length - 1 && loadingComplete) {
        // setAllStepsCompleted(true);
        clearInterval(intervalId); // Stop the interval when last step is completed
      } else {
        setCurrentStep(prevStep => (prevStep + 1) % steps.length);
        // setCompletedSteps([]);
      }
    }, totalDuration);

    return () => clearInterval(intervalId);
  }, [currentStep , loadingComplete]);

  useEffect(() => {
    if (currentStep !== 0 && !allStepsCompleted) {
      const flickerTimeout = setTimeout(() => {
        setLoadingComplete(true);
        setCompletedSteps(prevCompletedSteps => [...prevCompletedSteps, currentStep-1]);
      } , flickerDuration);
      
      return () => clearTimeout(flickerTimeout);
    }
  }, [currentStep, allStepsCompleted]);




  return (
    <div className="flex md:max-w-2xl md:min-w-[42rem] max-w-md font-medium flex-col gap-y-4 gap-2 rounded-xl shadow-lg px-3 py-2 text-xs md:text-base mx-1 md:mx-6">
      

      
      <div className="flex flex-row gap-3 items-center">
 {completedSteps.includes(0) || allStepsCompleted ? (
          <Image src={Tick} alt="tick" width={20} height={20} className="step-icon" />
        ) : (
          <Image src={Flicker} alt="flicker" width={20} height={20} className="step-icon" />
        )}

        <p className={`step-text ${completedSteps.includes(0) || allStepsCompleted ? 'text-white' : 'text-[#999999]'} mx-2 transition-colors duration-500`}>{steps[0]}</p>
      </div>

      {!allStepsCompleted && currentStep !== 0 && (
        <div className="flex flex-row gap-3 items-center">
          {currentStep === 1 && (
            <Image src={Flicker} alt="flicker" width={20} height={20} className="step-icon" />
          )}
          {completedSteps.includes(1) && (
            <Image src={Tick} alt="tick" width={20} height={20} className="step-icon" />
          )}
          <p className={`step-text ${completedSteps.includes(1) ? 'text-white' : 'text-[#999999]'} mx-2 transition-colors duration-500`}>{steps[1]}</p>
        </div>
      )}

    </div>
  );
};

export default ResearchLoader;
















