import Image from "next/image";
import Example from "../../../assets/example.png";

function InfoCardButton({ text }: { text: string }) {
  return (
    <button style={{ borderRadius: "5px", height: "40px", width: "100%", backgroundColor: "yellow", display: "flex", justifyContent: "center", alignItems: "center" }}>
      {text}
    </button>
  )
}

function MainButton({ text }: { text: string }) {
  return (
    <button style={{ borderRadius: "5px", height: "60px", width: "320px", backgroundColor: "yellow", display: "flex", justifyContent: "center", alignItems: "center" }}>
      {text}
    </button>
  )
}

function InfoCard() {
  return (
    <div style={{ borderRadius: "5px", backgroundColor: "green", margin: "0 2%", width: "300px", height: "400px" }}>
      <div style={{ position: "relative", height: "200px", width: "300px" }}>
        <Image style={{ borderRadius: "5px 5px 0px 0px" }} src={Example} alt="asdfasdf" objectFit="cover" layout="fill" />
      </div>
      <div style={{ padding: "20px" }}>
        <div style={{ fontSize: "32px" }}>
          Hello
        </div>
        <div style={{ padding: "20px 0px", fontSize: "16px" }}>
          Some random text hello this is a placeholder something
        </div>
        <InfoCardButton text={"Link To Guide"} />
      </div>
    </div>
  )
}

export default function AdviceView() {
  return (
    <div style={{ flex: 1 }}>
      <div style={{ height: "50%", background: "blue", display: "flex", justifyContent: "space-around" }}>
        <InfoCard />
        <InfoCard />
        <InfoCard />
        <InfoCard />
      </div>
      <div style={{ height: "30%", backgroundColor: "orange", display: "flex", alignItems: "center", justifyContent: "space-around" }}>
        <MainButton text={"Check out our First Year Guide"} />
      </div>
    </div>
  );
}