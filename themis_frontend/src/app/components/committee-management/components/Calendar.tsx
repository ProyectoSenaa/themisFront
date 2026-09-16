import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CalendarEvent } from '../types';
import { getDaysInMonth, getFirstDayOfMonth } from '../utils';

interface CalendarProps {
  currentDate: Date;
  calendarEvents: CalendarEvent[];
  selectedDateEvents: CalendarEvent[] | null;
  onNavigateMonth: (direction: "prev" | "next") => void;
  onSelectEvent: (event: CalendarEvent) => void;
  onSelectMultipleEvents: (events: CalendarEvent[]) => void;
  onCloseEventModal: () => void;
}

export const Calendar: React.FC<CalendarProps> = ({
  currentDate,
  calendarEvents,
  selectedDateEvents,
  onNavigateMonth,
  onSelectEvent,
  onSelectMultipleEvents,
  onCloseEventModal,
}) => {
  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days: JSX.Element[] = [];

    // Espacios vacíos para alinear el primer día del mes
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-20" />);
    }

    const todayISO = new Date().toISOString().slice(0, 10);

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const events = calendarEvents.filter(ev => ev.date === dateStr);
      const availableEvents = events.filter(ev => ev.isAvailable !== false);
      const hasAvailable = availableEvents.length > 0;
      const hasEvents = events.length > 0;
      const isToday = dateStr === todayISO;

      const base = 'group relative h-20 rounded-md border text-sm flex flex-col items-start justify-start px-2 py-1 select-none transition-all';
      const activeGreen = 'cursor-pointer bg-green-50/80 hover:bg-green-100 dark:bg-blue-700/40 dark:hover:bg-blue-600/50 text-green-800 dark:text-blue-100 shadow-sm hover:shadow';
      const inactive = 'cursor-not-allowed bg-muted/40 text-muted-foreground dark:bg-[#1f2a37] dark:text-gray-300 opacity-70';
      const redBusy = 'cursor-not-allowed bg-red-50/80 dark:bg-red-900/40 text-red-800 dark:text-red-200 opacity-90';
      const todayRing = isToday ? 'ring-2 ring-primary/60 dark:ring-blue-400/60' : '';
      const focusStyles = 'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/60';

      const className = `${base} ${hasAvailable ? activeGreen : (hasEvents ? redBusy : inactive)} ${todayRing} ${focusStyles}`;

      days.push(
        <button
          key={dateStr}
          type="button"
          className={className}
          aria-label={hasAvailable ? `Día ${day} con ${availableEvents.length} horario(s) disponible(s)` : (hasEvents ? `Día ${day} ocupado sin horarios disponibles` : `Día ${day} sin programación`)}
          disabled={!hasAvailable}
          onClick={() => {
            if (!hasAvailable) return;
            if (availableEvents.length === 1) {
              onSelectEvent(availableEvents[0]);
            } else if (availableEvents.length > 1) {
              onSelectMultipleEvents(availableEvents);
            }
          }}
        >
          <span className={`font-medium text-[13px] leading-none ${isToday ? 'text-primary dark:text-blue-300' : ''}`}>
            {day}
          </span>
          {hasAvailable && (
            <span className="mt-auto mb-1 ml-auto h-1.5 w-1.5 rounded-full bg-green-500 dark:bg-blue-300 group-hover:scale-110 transition-transform" />
          )}
          {!hasAvailable && hasEvents && (
            <span className="mt-auto mb-1 ml-auto h-1.5 w-1.5 rounded-full bg-red-500 dark:bg-red-400" />
          )}
        </button>
      );
    }
    return days;
  };

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onNavigateMonth("prev")}
              className="p-2"
            >
              <ChevronLeft size={16} />
            </Button>
            <Button
              variant="outline"
              onClick={() => onNavigateMonth("next")}
              className="p-2"
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {dayNames.map((day) => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground dark:text-gray-200 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-2">
          {renderCalendar()}
        </div>

        {/* Selected events modal */}
        {selectedDateEvents && selectedDateEvents.length > 0 && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <h3 className="text-lg font-semibold">
                  Eventos disponibles para {selectedDateEvents[0]?.date}
                </h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedDateEvents.map((event) => (
                    <div
                      key={event.id}
                      className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                      onClick={() => {
                        onSelectEvent(event);
                        onCloseEventModal();
                      }}
                    >
                      <div className="font-medium">{event.title}</div>
                      <div className="text-sm text-muted-foreground dark:text-gray-300">
                        {event.time} - {event.coordinationName}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" onClick={onCloseEventModal}>
                    Cerrar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
