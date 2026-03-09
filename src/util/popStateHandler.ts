import { PullVariants } from "@/app/page";

export default function handlePopStateChange(
  event: PopStateEvent,
  pullDirectionProp: React.Dispatch<React.SetStateAction<PullVariants>>,
  clicked: boolean,
  setClicked: React.Dispatch<React.SetStateAction<boolean>>,
  spacerHeight?: (spacerHeight: number) => void,
) {
  event.preventDefault();

  if (spacerHeight) {
    spacerHeight(0);
  }

  const next = !clicked;
  setClicked(next);

  console.log("popped", event.state.name);

  switch (event.state.name) {
    case "mid":
      pullDirectionProp("mid");
      break;
    case "left":
      pullDirectionProp("left");
      break;
    case "right":
      pullDirectionProp("right");
      break;
    case undefined:
    case "default":
      pullDirectionProp("default");
      break;
    default:
      console.log(`couldnt find event name: ${event.state.name}`);
  }
}
