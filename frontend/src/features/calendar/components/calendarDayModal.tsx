import Modal from "@/shared/components/modal";
import type { CalendarEvent } from "../lib/types";
import { formatDate } from "@/shared/lib/dateFormat";
import EventPillDetails from "./eventPillDetails";

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
      <div className="flex flex-col gap-4 items-center w-md">
        <p className="flock-h4">{formatDate(day)}</p>
        <div className="border-b border-neutral w-full" />
        {events.length > 0 ? (
          events.map((item) => (
            <EventPillDetails event={item} key={item.id} day={day} />
          ))
        ) : (
          <p className="flock-body text-neutral">No events to show</p>
        )}
      </div>
    </Modal>
  );
}
