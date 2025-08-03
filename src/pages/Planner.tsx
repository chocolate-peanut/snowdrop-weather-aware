import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { PlanCard } from '@/components/PlanCard';
import { PlanForm } from '@/components/PlanForm';
import { RecommendationCard } from '@/components/RecommendationCard';
import { usePlans } from '@/hooks/usePlans';
import { useSettings } from '@/hooks/useSettings';
import { Plan } from '@/types/plan';
import { Plus, Calendar as CalendarIcon, Settings as SettingsIcon } from 'lucide-react';
import { isAfter, startOfDay, format, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { Settings } from '@/pages/Settings';

export const Planner = () => {
  const { plans, addPlan, updatePlan, deletePlan } = usePlans();
  const { settings } = useSettings();
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | undefined>();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showSettings, setShowSettings] = useState(false);

  // Show upcoming plans (today and future)
  const today = startOfDay(new Date());
  const upcomingPlans = plans
    .filter(plan => isAfter(plan.date, today) || plan.date.toDateString() === today.toDateString())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);

  // Plans for selected date (for calendar view)
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

  if (showSettings) {
    return <Settings />;
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Planner</h1>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowForm(true)}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Plan
          </Button>
        </div>
      </div>

      {/* Calendar Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
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

        {/* Settings */}
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="w-5 h-5" />
              Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => setShowSettings(true)}
              variant="outline"
              className="w-full"
            >
              Open Settings
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Planner Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Plans */}
        <div className="space-y-4">
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                Upcoming Plans
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingPlans.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No upcoming plans. Add a new plan to get started!
                </p>
              ) : (
                upcomingPlans.map(plan => (
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

        {/* Recommendations */}
        <div className="space-y-4">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Indoor Activity Recommendations
            </h2>
            <p className="text-sm text-muted-foreground">
              Perfect for when you want to stay cozy at home
            </p>
          </div>

          <RecommendationCard
            type="book"
            recommendations={[]}
            userPreferences={settings.preferences.books}
          />

          <RecommendationCard
            type="movie"
            recommendations={[]}
            userPreferences={settings.preferences.movies}
          />

          <RecommendationCard
            type="music"
            recommendations={[]}
            userPreferences={settings.preferences.music}
          />
        </div>
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