import {
  FaCalendar,
  FaClock,
  FaLocationDot,
  FaCircleCheck,
} from "react-icons/fa6";

export default function EventPreview() {
  return (
    <div className="rounded-2xl shadow-md bg-white w-full overflow-hidden">
      <div className="bg-neutral w-full h-36" />
      <div className="p-6 flex flex-col gap-2">
        <div className="flex justify-between">
          <span className="flock-h4">Hemmafest!</span>
          <span className="inline-flex gap-2 items-center flock-body text-secondary">
            <FaCircleCheck />
            Going
          </span>
        </div>

        <span className="flex gap-4">
          <span className="inline-flex gap-2 items-center flock-body">
            <FaCalendar />
            Tomorrow
          </span>
          <span className="inline-flex gap-2 items-center flock-body">
            <FaClock />
            16:00 - 18:00
          </span>
        </span>
        <span className="inline-flex gap-2 items-center flock-body">
          <FaLocationDot />
          Industrigatan 7A
        </span>
      </div>
    </div>
  );
}

export function SmallEventPreview() {
  return (
    <div className="flex lg:flex-col h-28 w-full lg:h-48 lg:w-44 overflow-hidden rounded-2xl shadow-md bg-neutral/50">
      <div className="w-1/2 lg:h-1/2 lg:w-full bg-primary" />

      <div className="flex flex-1 flex-col justify-center gap-1 p-4">
        <span className="flex justify-between">
          <p className="flock-ui-label">Test event</p>
          <FaCircleCheck className="fill-secondary" />
        </span>

        <span className="inline-flex items-center gap-1 flock-caption">
          <FaCalendar />
          Tomorrow
        </span>

        <span className="inline-flex items-center gap-1 flock-caption text-nowrap">
          <FaLocationDot />
          Industrigatan 7A
        </span>
      </div>
    </div>
  );
}
