import { useState, useEffect } from 'react';
import { Plan } from '@/types/plan';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

export const usePlans = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // If no user, try to migrate from localStorage
        await migrateFromLocalStorage();
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('user_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching plans:', error);
        toast({
          title: "Error",
          description: "Failed to load plans. Please try again.",
          variant: "destructive",
        });
        return;
      }

      const plansWithDates = data.map(plan => ({
        ...plan,
        date: new Date(plan.date)
      }));
      
      setPlans(plansWithDates);
    } catch (error) {
      console.error('Error in fetchPlans:', error);
    } finally {
      setLoading(false);
    }
  };

  const migrateFromLocalStorage = async () => {
    const STORAGE_KEY = 'snowdrop-plans';
    const savedPlans = localStorage.getItem(STORAGE_KEY);
    
    if (savedPlans) {
      const parsedPlans = JSON.parse(savedPlans);
      const plansWithDates = parsedPlans.map((plan: any) => ({
        ...plan,
        date: new Date(plan.date)
      }));
      setPlans(plansWithDates);
      
      // Clear localStorage after migration attempt
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const addPlan = async (plan: Omit<Plan, 'id'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Fallback to localStorage if not authenticated
        const newPlan: Plan = {
          ...plan,
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
        };
        setPlans(prev => [...prev, newPlan]);
        
        // Save to localStorage
        const STORAGE_KEY = 'snowdrop-plans';
        const currentPlans = [...plans, newPlan];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentPlans));
        return;
      }

      const { data, error } = await supabase
        .from('user_plans')
        .insert({
          user_id: user.id,
          title: plan.title,
          date: plan.date.toISOString(),
          time: plan.time,
          location: plan.location,
          activity: plan.activity,
          type: plan.type,
          description: plan.description,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding plan:', error);
        toast({
          title: "Error",
          description: "Failed to add plan. Please try again.",
          variant: "destructive",
        });
        return;
      }

      const newPlan = {
        ...data,
        date: new Date(data.date)
      };
      
      setPlans(prev => [...prev, newPlan]);
      
      toast({
        title: "Success",
        description: "Plan added successfully!",
      });
    } catch (error) {
      console.error('Error in addPlan:', error);
      toast({
        title: "Error",
        description: "Failed to add plan. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updatePlan = async (id: string, updatedPlan: Partial<Plan>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Fallback to localStorage if not authenticated
        const updatedPlans = plans.map(plan => 
          plan.id === id ? { ...plan, ...updatedPlan } : plan
        );
        setPlans(updatedPlans);
        
        const STORAGE_KEY = 'snowdrop-plans';
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPlans));
        return;
      }

      const updateData: any = {};
      if (updatedPlan.title !== undefined) updateData.title = updatedPlan.title;
      if (updatedPlan.date !== undefined) updateData.date = updatedPlan.date.toISOString();
      if (updatedPlan.time !== undefined) updateData.time = updatedPlan.time;
      if (updatedPlan.location !== undefined) updateData.location = updatedPlan.location;
      if (updatedPlan.activity !== undefined) updateData.activity = updatedPlan.activity;
      if (updatedPlan.type !== undefined) updateData.type = updatedPlan.type;
      if (updatedPlan.description !== undefined) updateData.description = updatedPlan.description;

      const { error } = await supabase
        .from('user_plans')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating plan:', error);
        toast({
          title: "Error",
          description: "Failed to update plan. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setPlans(prev => prev.map(plan => 
        plan.id === id ? { ...plan, ...updatedPlan } : plan
      ));
      
      toast({
        title: "Success",
        description: "Plan updated successfully!",
      });
    } catch (error) {
      console.error('Error in updatePlan:', error);
      toast({
        title: "Error",
        description: "Failed to update plan. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deletePlan = async (id: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Fallback to localStorage if not authenticated
        const updatedPlans = plans.filter(plan => plan.id !== id);
        setPlans(updatedPlans);
        
        const STORAGE_KEY = 'snowdrop-plans';
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPlans));
        return;
      }

      const { error } = await supabase
        .from('user_plans')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting plan:', error);
        toast({
          title: "Error",
          description: "Failed to delete plan. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setPlans(prev => prev.filter(plan => plan.id !== id));
      
      toast({
        title: "Success",
        description: "Plan deleted successfully!",
      });
    } catch (error) {
      console.error('Error in deletePlan:', error);
      toast({
        title: "Error",
        description: "Failed to delete plan. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    plans,
    loading,
    addPlan,
    updatePlan,
    deletePlan,
    refreshPlans: fetchPlans
  };
};