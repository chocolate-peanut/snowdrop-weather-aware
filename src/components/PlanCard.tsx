import { Plan } from '@/types/plan';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Edit, Trash2, Home, Trees } from 'lucide-react';
import { format } from 'date-fns';

interface PlanCardProps {
  plan: Plan;
  onEdit: (plan: Plan) => void;
  onDelete: (id: string) => void;
}

export const PlanCard = ({ plan, onEdit, onDelete }: PlanCardProps) => {
  return (
    <Card className="glass-card border-0">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-card-foreground">{plan.title}</h3>
              <div className="flex items-center gap-1">
                {plan.type === 'indoor' ? (
                  <Home className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Trees className="w-4 h-4 text-muted-foreground" />
                )}
                <span className="text-sm text-muted-foreground capitalize">{plan.type}</span>
              </div>
            </div>
            
            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{format(plan.date, 'MMM dd, yyyy')} at {plan.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{plan.location}</span>
              </div>
              <p className="mt-2 text-card-foreground">{plan.activity}</p>
              {plan.description && (
                <p className="text-muted-foreground mt-1">{plan.description}</p>
              )}
            </div>
          </div>
          
          <div className="flex gap-2 ml-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(plan)}
              className="text-muted-foreground hover:text-foreground"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(plan.id)}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};