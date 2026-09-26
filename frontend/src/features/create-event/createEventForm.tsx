"use client";
import ImageUpload from "@/shared/components/imageUpload";
import Input from "@/shared/components/formInputs";
import { TextArea } from "@/shared/components/formInputs";

import { FaHeading } from "react-icons/fa6";
import { FaCalendarDay } from "react-icons/fa6";
import { FaClock } from "react-icons/fa6";
import { FaFileLines } from "react-icons/fa6";
import { FaLocationDot } from "react-icons/fa6";

export default function CreateEventForm() {
  return (
    <form className="flex flex-col gap-4">
      <ImageUpload />
      <span className="flex flex-1 max-sm:flex-wrap gap-2">
        <Input
          icon={<FaHeading />}
          type="text"
          label="Event title"
          placeholder="Title"
        />
        <Input
          icon={<FaLocationDot />}
          type="text"
          label="Location"
          placeholder="Search address..."
        />
      </span>

      <span className="flex flex-wrap gap-2">
        <span className="flex flex-1 max-sm:flex-wrap gap-2">
          <Input icon={<FaCalendarDay />} type="date" label="Startdate" />
          <Input icon={<FaClock />} type="time" label="Starttime" />
        </span>
        <span className="flex flex-1 max-sm:flex-wrap gap-2">
          <Input icon={<FaCalendarDay />} type="date" label="Enddate" />
          <Input icon={<FaClock />} type="time" label="Endtime" />
        </span>
      </span>
      <TextArea icon={<FaFileLines />} />
    </form>
  );
}
