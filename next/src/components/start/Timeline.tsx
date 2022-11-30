import styled from "styled-components";

function TimelineButton({ text, filled }: { text: string, filled: boolean }) {
  return (
    <button>
      {text}
    </button>
  );
}

const Circle = styled.div`
  border-radius: 100%;
  border: 2px solid black;
  width: 25px;
  height: 25px;
`

function TimelineCircle({ filled }: { filled: boolean }) {
  return (
    <Circle />
  )
}

export default function Timeline({ focusedView, viewNames }: { focusedView: number, viewNames: string[] }) {


  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
      <div style={{ position: "absolute", width: "100%", display: "flex", justifyContent: "space-around" }}>
        {viewNames.map((name, idx) => {
          return (
            <>
              <TimelineCircle filled={idx <= focusedView} />
              <TimelineButton text={viewNames[idx]} filled={idx <= focusedView} />
            </>
          )
        })}
      </div>
      <div style={{ flex: 1, border: "2px solid black" }} />
      {/* <TimelineButton text={viewNames[focusedView]} /> */}
    </div>
  )
}