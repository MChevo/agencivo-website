import React, { useState, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import Sidebar from "../components/Sidebar";
import Button from "../components/Button";
import DotField from "../components/DotField";
import { MessageSquare, Send, User, Shield, Paperclip, Search } from "lucide-react";

export const MessagesPage = () => {
  const { briefs, messages, sendChatMessage, selectedBriefId, setSelectedBriefId, fetchMessages, user } = useApp();
  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const messagesEndRef = useRef(null);

  // Filter out briefs that are active client projects (not Code Unused placeholders)
  const clientBriefs = briefs.filter(
    (b) => b.status !== "Code Unused" && b.brandName !== "Pending Client"
  );

  const filteredBriefs = clientBriefs.filter((b) =>
    b.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.projectType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle setting default selected brief if none is set
  useEffect(() => {
    if (!selectedBriefId && clientBriefs.length > 0) {
      setSelectedBriefId(clientBriefs[0].id);
    }
  }, [clientBriefs, selectedBriefId, setSelectedBriefId]);

  // Fetch messages when selected brief changes
  useEffect(() => {
    if (selectedBriefId) {
      fetchMessages(selectedBriefId);
    }
  }, [selectedBriefId]);

  const activeBrief = briefs.find(b => b.id === selectedBriefId);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || sending || !selectedBriefId) return;

    setSending(true);
    // Agency is sending the message
    const success = await sendChatMessage("agency", inputText.trim());
    setSending(false);

    if (success) {
      setInputText("");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#fbfbfa] w-full">
      <Sidebar />
      <section className="relative flex-1 overflow-hidden p-6 md:p-10 flex flex-col">
        <DotField className="right-0 top-20 h-80 w-72" dense />

        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black tracking-[-0.04em] text-black">Client Messages</h1>
            <p className="text-neutral-500 text-sm mt-1">Real-time collaborative chat workspace with active briefs.</p>
          </div>
        </div>

        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[300px_1fr] rounded-2xl border border-neutral-200 bg-white shadow-xs overflow-hidden">
          
          {/* Chat Channels Sidebar */}
          <div className="border-r border-neutral-200 flex flex-col bg-neutral-50/50">
            <div className="p-4 border-b border-neutral-200 bg-white">
              <div className="rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2 flex items-center focus-within:border-black focus-within:bg-white">
                <Search className="mr-2 text-neutral-400 shrink-0" size={15} />
                <input
                  className="w-full bg-transparent outline-none text-xs text-neutral-800"
                  placeholder="Search channels..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto divide-y divide-neutral-100">
              {filteredBriefs.length === 0 ? (
                <div className="text-center py-12 text-neutral-400 text-xs font-semibold px-4">
                  No active channels. Create and complete a brief first.
                </div>
              ) : (
                filteredBriefs.map((brief) => {
                  const isActive = brief.id === selectedBriefId;
                  return (
                    <button
                      key={brief.id}
                      onClick={() => setSelectedBriefId(brief.id)}
                      className={`w-full text-left p-4 transition-all flex flex-col gap-1.5 focus:outline-none ${
                        isActive ? "bg-white border-l-4 border-black" : "hover:bg-neutral-100/50"
                      }`}
                    >
                      <div className="flex justify-between items-start w-full">
                        <b className="text-sm text-black font-bold block truncate max-w-[170px]">
                          {brief.brandName}
                        </b>
                        <span className="text-[9px] font-mono font-semibold px-2 py-0.5 bg-neutral-200 rounded text-neutral-600 uppercase">
                          {brief.code.split("-")[1] || "CODE"}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 truncate">{brief.projectType}</p>
                      <span className="text-[10px] uppercase font-bold text-[#ff6a00] bg-[#ff6a00]/5 px-2 py-0.5 rounded border border-[#ff6a00]/10 w-fit">
                        {brief.status}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Main Chat Workspace */}
          <div className="flex flex-col h-[600px] lg:h-auto min-h-0 bg-white">
            {activeBrief ? (
              <>
                {/* Chat Header */}
                <div className="p-5 border-b border-neutral-200 flex justify-between items-center bg-white shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
                  <div>
                    <h3 className="text-lg font-bold text-black flex items-center gap-2">
                      {activeBrief.brandName}
                      <span className="text-xs font-mono font-normal text-neutral-400">({activeBrief.code})</span>
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5">{activeBrief.projectType} • Workspace</p>
                  </div>
                  <div className="text-right hidden sm:block">
                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">Project Status</span>
                    <span className="text-xs font-semibold text-black uppercase">{activeBrief.status}</span>
                  </div>
                </div>

                {/* Messages Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-neutral-50/20">
                  {messages.length === 0 ? (
                    <div className="text-center py-20 text-neutral-400 text-sm">
                      <MessageSquare className="mx-auto text-neutral-300 mb-2" size={32} />
                      No messages yet. Send a message to start the conversation!
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isAgency = msg.sender === "agency";
                      const isSystem = msg.sender === "system";
                      const timeString = new Date(msg.time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit"
                      });

                      if (isSystem) {
                        return (
                          <div key={msg.id} className="flex justify-center my-3">
                            <span className="text-[10px] font-semibold text-neutral-500 bg-neutral-100 border border-neutral-200 px-3 py-1 rounded-full text-center">
                              {msg.text}
                            </span>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={msg.id}
                          className={`flex gap-3 max-w-[80%] ${isAgency ? "ml-auto flex-row-reverse" : "mr-auto"}`}
                        >
                          <div className={`h-8 w-8 rounded-full border shrink-0 flex items-center justify-center font-bold text-xs uppercase ${
                            isAgency ? "bg-black text-white border-black" : "bg-neutral-100 text-neutral-800 border-neutral-300"
                          }`}>
                            {isAgency ? "A" : "C"}
                          </div>
                          <div>
                            <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                              isAgency
                                ? "bg-black text-white rounded-tr-xs"
                                : "bg-white text-neutral-900 border border-neutral-200 rounded-tl-xs shadow-[0_1px_3px_rgba(0,0,0,0.01)]"
                            }`}>
                              {msg.text}
                            </div>
                            <span className={`text-[10px] text-neutral-400 mt-1 block ${isAgency ? "text-right" : "text-left"}`}>
                              {isAgency ? "Agency" : activeBrief.brandName} • {timeString}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Chat Input Footer */}
                <form onSubmit={handleSend} className="p-4 border-t border-neutral-200 bg-white flex gap-3 items-center">
                  <button
                    type="button"
                    className="p-3 border border-neutral-200 rounded-xl hover:bg-neutral-50 text-neutral-400 hover:text-black focus:outline-none"
                    aria-label="Upload files"
                  >
                    <Paperclip size={18} />
                  </button>
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={`Type a message to ${activeBrief.brandName}...`}
                    className="flex-1 border border-neutral-300 bg-white rounded-xl px-4 py-3.5 text-sm outline-none focus:border-black"
                    disabled={sending}
                  />
                  <Button
                    type="submit"
                    className="py-3 px-5 flex items-center gap-2"
                    disabled={sending || !inputText.trim()}
                  >
                    <Send size={15} />
                    <span className="hidden sm:inline">Send</span>
                  </Button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-10 text-neutral-400">
                <MessageSquare className="text-neutral-200 mb-4" size={54} />
                <h4 className="font-bold text-black text-lg">No Active Chats</h4>
                <p className="text-xs text-neutral-500 mt-2 max-w-[280px]">
                  Provide a generated project code to your clients. Once a client submits their project brief, a real-time chat room is created.
                </p>
              </div>
            )}
          </div>

        </div>
      </section>
    </div>
  );
};

export default MessagesPage;
