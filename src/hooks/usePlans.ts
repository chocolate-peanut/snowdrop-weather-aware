import { useState, useEffect } from 'react';
import { Plan } from '@/types/plan';

const STORAGE_KEY = 'snowdrop-plans';

export const usePlans = () => {
  const [plans, setPlans] = useState<Plan[]>([]);

  useEffect(() => {
    const savedPlans = localStorage.getItem(STORAGE_KEY);
    if (savedPlans) {
      const parsedPlans = JSON.parse(savedPlans);
      // Convert date strings back to Date objects
      const plansWithDates = parsedPlans.map((plan: any) => ({
        ...plan,
        date: new Date(plan.date)
      }));
      setPlans(plansWithDates);
    }
  }, []);

  const savePlans = (newPlans: Plan[]) => {
    setPlans(newPlans);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newPlans));
  };

  const addPlan = (plan: Omit<Plan, 'id'>) => {
    const newPlan: Plan = {
      ...plan,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    };
    savePlans([...plans, newPlan]);
  };

  const updatePlan = (id: string, updatedPlan: Partial<Plan>) => {
    const updatedPlans = plans.map(plan => 
      plan.id === id ? { ...plan, ...updatedPlan } : plan
    );
    savePlans(updatedPlans);
  };

  const deletePlan = (id: string) => {
    const updatedPlans = plans.filter(plan => plan.id !== id);
    savePlans(updatedPlans);
  };

  return {
    plans,
    addPlan,
    updatePlan,
    deletePlan
  };
};