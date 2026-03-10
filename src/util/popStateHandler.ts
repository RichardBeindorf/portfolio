import { PullVariants } from "@/app/page";

export default function handlePopStateChange(
  event: PopStateEvent,
  pullDirectionProp: React.Dispatch<React.SetStateAction<PullVariants>>,
  clicked: boolean,
  setClicked: React.Dispatch<React.SetStateAction<boolean>>,
  pullDirection: PullVariants,
  spacerHeight?: (spacerHeight: number) => void,
) {
  event.preventDefault();

  if (spacerHeight) {
    spacerHeight(0);
  }

  const next = !clicked;
  setClicked(next);

  if (pullDirection === "default") {
    pullDirectionProp(event.state.name);
  } else {
    pullDirectionProp("default");
  }
}
