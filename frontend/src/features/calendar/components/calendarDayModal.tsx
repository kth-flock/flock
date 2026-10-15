import Modal from "@/shared/components/modal";
import type { CalendarEvent } from "./calendarView";
import { formatDate } from "@/shared/lib/dateFormat";
import EventPill from "./eventPill";

type CalendarDayModalProps = {
  isOpen: boolean;
  onClose?: () => void;
  day: Date;
  events?: CalendarEvent[];
};

export default function CalendarDayModal({
  isOpen,
  onClose,
  day,
  events = [],
}: CalendarDayModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-2 items-center">
        <p className="flock-h4">{formatDate(day)}</p>
        {events.length > 0 ? (
          events.map((item) => <EventPill event={item} key={item.id} />)
        ) : (
          <p className="flock-body text-neutral">No events to show</p>
        )}
      </div>
    </Modal>
  );
}
