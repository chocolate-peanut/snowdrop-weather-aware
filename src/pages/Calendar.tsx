import { useState } from 'react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlanCard } from '@/components/PlanCard';
import { PlanForm } from '@/components/PlanForm';
import { usePlans } from '@/hooks/usePlans';
import { Plan } from '@/types/plan';
import { Plus } from 'lucide-react';
import { format, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';

export const Calendar = () => {
  const { plans, addPlan, updatePlan, deletePlan } = usePlans();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | undefined>();

  const selectedPlans = plans.filter(plan => 
    isSameDay(plan.date, selectedDate)
  );

  const planDates = plans.map(plan => plan.date);

  const handleSavePlan = (planData: Omit<Plan, 'id'> | Plan) => {
    if ('id' in planData) {
      updatePlan(planData.id, planData);
    } else {
      addPlan(planData);
    }
    setShowForm(false);
    setEditingPlan(undefined);
  };

  const handleEditPlan = (plan: Plan) => {
    setEditingPlan(plan);
    setShowForm(true);
  };

  const handleDeletePlan = (id: string) => {
    deletePlan(id);
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Calendar</h1>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Plan
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              modifiers={{
                hasPlans: planDates
              }}
              modifiersStyles={{
                hasPlans: {
                  backgroundColor: 'hsl(var(--primary) / 0.2)',
                  color: 'hsl(var(--primary))',
                  fontWeight: 'bold'
                }
              }}
              className={cn("pointer-events-auto")}
            />
          </CardContent>
        </Card>

        {/* Plans for selected date */}
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle>Plans for {format(selectedDate, 'MMMM dd, yyyy')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedPlans.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No plans for this date. Add a new plan to get started!
              </p>
            ) : (
              selectedPlans.map(plan => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  onEdit={handleEditPlan}
                  onDelete={handleDeletePlan}
                />
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {showForm && (
        <PlanForm
          plan={editingPlan}
          onSave={handleSavePlan}
          onCancel={() => {
            setShowForm(false);
            setEditingPlan(undefined);
          }}
        />
      )}
    </div>
  );
};