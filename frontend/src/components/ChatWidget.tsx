import React, { useEffect, useRef, useState } from "react";
import { IoChatbubblesOutline, IoClose } from "react-icons/io5";

type Msg = { role: "user"|"assistant", text: string };

export default function ChatWidget() {
  const [open, setOpen] = useState<boolean>(() => {
    const saved = localStorage.getItem("cw_chat_open");
    return saved ? JSON.parse(saved) : true; 
  });
  const [msgs, setMsgs] = useState<Msg[]>([
    {role:"assistant", text:"Hi! I’m your Carbon Coach. Ask me how to lower your footprint in a happy, practical way 🌿"}
  ]);
  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{
    localStorage.setItem("cw_chat_open", JSON.stringify(open));
  },[open]);

  useEffect(()=>{
    listRef.current?.scrollTo({top: 999999, behavior:"smooth"});
  },[msgs, open]);

  async function send() {
    const q = input.trim();
    if(!q) return;
    setMsgs(m => [...m, {role:"user", text:q}]);
    setInput("");
    try{
      const res = await fetch("http://127.0.0.1:8000/coach", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ query:q, locale:"IN" })
      });
      const data = await res.json();
      setMsgs(m => [...m, {role:"assistant", text: data.reply || "I’m here to help—try asking about transport, energy, or food."}]);
    }catch{
      setMsgs(m => [...m, {role:"assistant", text:"(Offline demo) Try shorter questions like: “How to cut AC power?”"}]);
    }
  }

  return (
    <div style={{position:"fixed", right:20, bottom:20, zIndex:60}}>
      {!open && (
        <button className="cta" onClick={()=>setOpen(true)}>
          <IoChatbubblesOutline/> Ask Coach
        </button>
      )}
      {open && (
        <div className="card" style={{width:340, height:430, display:"grid", gridTemplateRows:"auto 1fr auto"}}>
          <div style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
            <strong>Carbon Coach</strong>
            <button className="ghost" onClick={()=>setOpen(false)}><IoClose/></button>
          </div>
          <div ref={listRef} style={{overflow:"auto", display:"grid", gap:10, padding:"6px 2px"}}>
            {msgs.map((m,i)=>(
              <div key={i} style={{
                justifySelf: m.role==="user"?"end":"start",
                background: m.role==="user"?"#eaf7ff":"#edf8f3",
                color:"#16324f",
                padding:"10px 12px", borderRadius:12, maxWidth:260
              }}>{m.text}</div>
            ))}
          </div>
          <div style={{display:"grid", gridTemplateColumns:"1fr auto", gap:8}}>
            <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Type your question…" />
            <button className="btn btn-brand" onClick={send}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}
