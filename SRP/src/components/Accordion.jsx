import React from "react";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
 
function Icon({ id, open }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={`${id === open ? "rotate-180" : ""} h-5 w-5 transition-transform`}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  );
}
 
export function AccordionCustomIcon() {
  const [open, setOpen] = React.useState(0);
 
  const handleOpen = (value) => setOpen(open === value ? 0 : value);
 
  return (
    <>
      <Accordion open={open === 1} icon={<Icon id={1} open={open} />}>
        <AccordionHeader onClick={() => handleOpen(1)} className="text-lg lg:text-2xl ">What are senior high school strands?</AccordionHeader>
        <AccordionBody className='text-base dark:text-white'>
        Senior high school strands are specialized academic tracks or fields of study designed to help
         students focus on specific areas of interest. 
        These strands typically include academic, technical-vocational,
         and specialized subjects that cater to various career pathways.
        </AccordionBody>
      </Accordion>
      <Accordion open={open === 2} icon={<Icon id={2} open={open} />}>
        <AccordionHeader onClick={() => handleOpen(2)} className="text-lg lg:text-2xl ">
        Can I pursue college programs unrelated to my senior high school strand?
        </AccordionHeader>
        <AccordionBody className='text-base dark:text-white'>
        Yes, senior high school strands help in guiding your career path, but they don't rigidly dictate your future.
        Students often pursue college programs that might be different from their high school strands.
         The skills and knowledge gained are transferable across various fields.
        </AccordionBody>
      </Accordion>
      <Accordion open={open === 4} icon={<Icon id={4} open={open} />}>
        <AccordionHeader onClick={() => handleOpen(4)} className="text-lg lg:text-2xl ">
        How does the specialization in a particular strand benefit future college or career options?
        </AccordionHeader>
        <AccordionBody className='text-base dark:text-white'>
        Specializing in a particular strand can provide a solid foundation in a specific field of study. 
        It can help in pursuing relevant college programs and career paths by providing foundational knowledge 
        and skills aligned with the chosen strand.
        </AccordionBody>
      </Accordion>
      <Accordion open={open === 5} icon={<Icon id={5} open={open} />}>
        <AccordionHeader onClick={() => handleOpen(5)} className="text-lg lg:text-2xl ">
        What subjects are covered in the STEM (Science, Technology, Engineering, and Mathematics) strand?
        </AccordionHeader>
        <AccordionBody className='text-base dark:text-white'>
        The STEM strand typically includes subjects like mathematics, physics, biology, chemistry, and technology-related courses. 
        This track is designed for students interested in pursuing careers in science, engineering, technology, and mathematics fields.
        </AccordionBody>
      </Accordion>
      <Accordion open={open === 6} icon={<Icon id={6} open={open} />}>
        <AccordionHeader onClick={() => handleOpen(6)} className="text-lg lg:text-2xl ">
        What are the key differences between the ABM (Accountancy, Business, and Management) and HUMSS (Humanities and Social Sciences) strands?
        </AccordionHeader>
        <AccordionBody className='text-base dark:text-white'>
        The ABM strand focuses on business-related subjects such as accounting, economics, and entrepreneurship. HUMSS, on the other hand, 
        concentrates on humanities and social sciences, covering subjects like philosophy, history, sociology, and literature.
        </AccordionBody>
      </Accordion>
      <Accordion open={open === 7} icon={<Icon id={7} open={open} />}>
        <AccordionHeader onClick={() => handleOpen(7)} className="text-lg lg:text-2xl ">
        How do I know which strand aligns best with my interests and career goals?
        </AccordionHeader>
        <AccordionBody className='text-base dark:text-white'>
        Consider your strengths, interests, and career aspirations when choosing a strand. Some schools offer assessment tests 
        or guidance counseling to help match your skills and interests to the appropriate strand.
        </AccordionBody>
      </Accordion>
      <Accordion open={open === 8} icon={<Icon id={8} open={open} />}>
      <AccordionHeader onClick={() => handleOpen(8)} className="text-lg lg:text-2xl ">
      Can I pursue a specific career with any senior high school strand?
      </AccordionHeader>
      <AccordionBody className='text-base dark:text-white'>
      Each strand offers a unique set of subjects tailored to specific career paths. 
      While certain strands might more directly align with specific careers, 
      many paths are open to students regardless of their chosen strand.
      </AccordionBody>
    </Accordion>

    </>
  );
}