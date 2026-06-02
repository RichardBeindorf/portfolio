export default function CloseIcon({
  pullDirection,
  pullDirectionProp,
  mobileTest,
}) {
  return (
    <div
      style={{
        position: "absolute",
        top: -30,
        left: mobileTest ? "75dvw" : "25dvw",
        zIndex: 10000,
      }}
    >
      <svg
        width="30"
        height="28"
        viewBox="0 0 30 28"
        fill="none"
        onClick={() => {
          if (
            pullDirection === "right" ||
            pullDirection === "mid" ||
            pullDirection === "left"
          )
            pullDirectionProp("default");
        }}
      >
        <path
          d="M20.6339 2.92786C18.7495 2.18387 13.0027 0.832349 8.40544 1.01717C4.08475 1.19088 2.46864 7.78147 1.31401 11.4102C0.774863 13.1046 0.980959 15.0278 1.54602 16.9107C2.92465 21.5045 8.83531 24.064 13.419 25.919C15.7134 26.8476 17.976 26.5648 19.7311 26.5586C21.4095 26.5528 23.0672 25.2645 24.6848 23.8225C27.9772 20.8873 28.4592 16.0733 28.2691 13.9155C26.0824 11.1603 24.2836 9.6142 23.3878 8.25483C22.9214 7.57003 22.4308 6.89545 21.3678 6.0146"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M10.4888 8.67578C10.6093 8.67578 11.7015 9.43143 13.7138 11.0358C15.5993 12.8033 16.9873 14.4672 17.977 15.9041C18.5093 16.6239 19.1028 17.3244 20.2624 19.6935"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M8.65576 19.6935C9.74872 19.2029 12.5023 16.392 14.9101 12.0977C15.5087 11.1414 16.1126 10.4668 16.7854 9.87404C17.4582 9.28123 18.1817 8.79062 19.1097 8.28516"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
