import { ProjectGallery } from "./ProjectGallery";
import { ProjectCaseStudy } from "./ProjectCaseStudy";
import { ExperienceTimeline } from "./ExperienceTimeline";
import { HackathonGallery } from "./HackathonGallery";
import { SkillGraph } from "./SkillGraph";
import { ResumeViewer } from "./ResumeViewer";
import { WhyHireMe } from "./WhyHireMe";
import { ContactCard } from "./ContactCard";
import { DevPanel } from "./DevPanel";
import { SurpriseMoment } from "./SurpriseMoment";

export type WidgetData = { projectId?: string | null; text?: string } | null;

export function WidgetRenderer({
  name,
  data,
  onOpenProject,
}: {
  name: string;
  data?: WidgetData;
  onOpenProject?: (id: string) => void;
}) {
  switch (name) {
    case "ProjectGallery":
      return <ProjectGallery onOpenProject={onOpenProject} />;
    case "ProjectCaseStudy":
      return <ProjectCaseStudy projectId={data?.projectId} />;
    case "ExperienceTimeline":
      return <ExperienceTimeline />;
    case "HackathonGallery":
      return <HackathonGallery />;
    case "SkillGraph":
      return <SkillGraph />;
    case "ResumeViewer":
      return <ResumeViewer />;
    case "WhyHireMe":
      return <WhyHireMe />;
    case "ContactCard":
      return <ContactCard />;
    case "DevPanel":
      return <DevPanel />;
    case "SurpriseMoment":
      return <SurpriseMoment text={data?.text ?? ""} />;
    default:
      return null;
  }
}
