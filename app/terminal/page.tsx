"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Terminal as TerminalIcon } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { ThreeBackground } from "@/components/three-background";
import { setCookie, getCookie } from "@/utils/cookies";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function Terminal() {
  const [command, setCommand] = useState("");
  const [output, setOutput] = useState<string[]>([
    "Welcome to the interactive terminal!",
    "Type 'help' to see available commands.",
    "",
  ]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [tabSuggestions, setTabSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  
  // Load history from cookies on mount
  useEffect(() => {
    const savedHistory = getCookie('terminalHistory');
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        if (Array.isArray(parsedHistory)) {
          setHistory(parsedHistory);
        }
      } catch (e) {
        console.error("Error parsing terminal history:", e);
      }
    }
  }, []);
  
  // Save history to cookies whenever it changes
  useEffect(() => {
    if (history.length > 0) {
      // Limit history to last 50 commands to keep cookie size reasonable
      const limitedHistory = history.slice(-50);
      setCookie('terminalHistory', JSON.stringify(limitedHistory));
    }
  }, [history]);
  
  // Available commands
  const commands = {
    help: "Display available commands",
    clear: "Clear the terminal",
    about: "Learn about this website",
    projects: "View my projects",
    contact: "Get my contact information",
    skills: "See my technical skills",
    github: "Visit my GitHub profile",
    date: "Display current date and time",
    echo: "Echo a message",
    whoami: "Display current user",
    ls: "List directory contents",
    cd: "Change directory",
    cat: "View file contents",
    mkdir: "Create a directory",
    rm: "Remove a file or directory",
    pwd: "Print working directory",
    history: "View command history",
    clearhistory: "Clear command history",
  };
  
  // Cursor blink effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 500);
    
    return () => clearInterval(interval);
  }, []);
  
  // Auto-scroll to bottom of terminal
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);
  
  // Focus input on mount and click
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!command.trim()) return;
    
    // Add command to output
    const newOutput = [...output, `> ${command}`, ""];
    
    // Process command
    const args = command.trim().split(" ");
    const cmd = args[0].toLowerCase();
    
    // Add to history (only if it's not the same as the last command)
    if (history.length === 0 || history[history.length - 1] !== command) {
      setHistory(prev => [...prev, command]);
    }
    setHistoryIndex(-1);
    
    // Process commands
    switch (cmd) {
      case "help":
        newOutput.pop(); // Remove empty line
        newOutput.push("Available commands:");
        Object.entries(commands).forEach(([cmd, desc]) => {
          newOutput.push(`  ${cmd.padEnd(12)} - ${desc}`);
        });
        newOutput.push(""); // Add empty line at end
        break;
        
      case "clear":
        setOutput([""]); // Clear output
        setCommand("");
        return;
        
      case "clearhistory":
        setHistory([]);
        setCookie('terminalHistory', '[]');
        newOutput.pop();
        newOutput.push("Command history cleared.");
        newOutput.push("");
        break;
        
      case "about":
        newOutput.pop();
        newOutput.push("About Me:");
        newOutput.push("  I'm a 13-year-old developer, gamer, and tech enthusiast");
        newOutput.push("  with a passion for creating web experiences that stand out!");
        newOutput.push("  My focus is on building sleek designs with eye-catching animations.");
        newOutput.push("  Currently diving into Next.js and TypeScript.");
        newOutput.push("");
        break;
        
      case "projects":
        newOutput.pop();
        newOutput.push("My Projects:");
        newOutput.push("  - This portfolio website (Next.js, TypeScript, Tailwind CSS)");
        newOutput.push("  - Tetris game (React, Canvas API)");
        newOutput.push("  - Interactive terminal (You're using it now!)");
        newOutput.push("");
        break;
        
      case "contact":
        newOutput.pop();
        newOutput.push("Contact Information:");
        newOutput.push("  Email: contact.moritzfreund@gmail.com");
        newOutput.push("  GitHub: github.com/glimme01");
        newOutput.push("  YouTube: youtube.com/@glimme01");
        newOutput.push("");
        break;
        
      case "skills":
        newOutput.pop();
        newOutput.push("Technical Skills:");
        newOutput.push("  Languages: JavaScript, TypeScript, HTML, CSS");
        newOutput.push("  Frameworks: React, Next.js");
        newOutput.push("  Tools: Git, VS Code, Figma");
        newOutput.push("  Other: Responsive Design, Animation, Game Development");
        newOutput.push("");
        break;
        
      case "github":
        newOutput.pop();
        newOutput.push("Opening GitHub profile...");
        newOutput.push("");
        window.open("https://github.com/glimme01", "_blank");
        break;
        
      case "date":
        newOutput.pop();
        newOutput.push(new Date().toString());
        newOutput.push("");
        break;
        
      case "echo":
        newOutput.pop();
        newOutput.push(args.slice(1).join(" ") || "");
        newOutput.push("");
        break;
        
      case "whoami":
        newOutput.pop();
        newOutput.push("visitor");
        newOutput.push("");
        break;
        
      case "ls":
        newOutput.pop();
        newOutput.push("about.txt  projects.txt  skills.txt  contact.txt  games/  src/");
        newOutput.push("");
        break;
        
      case "cd":
        newOutput.pop();
        newOutput.push(args[1] ? `Changed directory to ${args[1]}` : "No directory specified");
        newOutput.push("");
        break;
        
      case "cat":
        newOutput.pop();
        if (!args[1]) {
          newOutput.push("Usage: cat <filename>");
        } else if (args[1] === "about.txt") {
          newOutput.push("I'm a 13-year-old developer, gamer, and tech enthusiast");
          newOutput.push("with a passion for creating web experiences that stand out!");
        } else if (args[1] === "projects.txt") {
          newOutput.push("- Portfolio website (Next.js, TypeScript, Tailwind CSS)");
          newOutput.push("- Tetris game (React, Canvas API)");
          newOutput.push("- Interactive terminal");
        } else if (args[1] === "skills.txt") {
          newOutput.push("JavaScript, TypeScript, React, Next.js, HTML, CSS");
        } else if (args[1] === "contact.txt") {
          newOutput.push("Email: contact.moritzfreund@gmail.com");
          newOutput.push("GitHub: github.com/glimme01");
          newOutput.push("YouTube: youtube.com/@glimme01");
        } else {
          newOutput.push(`File not found: ${args[1]}`);
        }
        newOutput.push("");
        break;
        
      case "mkdir":
        newOutput.pop();
        newOutput.push(args[1] ? `Created directory: ${args[1]}` : "No directory name specified");
        newOutput.push("");
        break;
        
      case "rm":
        newOutput.pop();
        newOutput.push(args[1] ? `Removed: ${args[1]}` : "No file or directory specified");
        newOutput.push("");
        break;
        
      case "pwd":
        newOutput.pop();
        newOutput.push("/home/visitor/portfolio");
        newOutput.push("");
        break;
        
      case "history":
        newOutput.pop();
        if (history.length === 0) {
          newOutput.push("No command history");
        } else {
          history.forEach((cmd, i) => {
            newOutput.push(`${i + 1}  ${cmd}`);
          });
        }
        newOutput.push("");
        break;
        
      default:
        newOutput.pop();
        newOutput.push(`Command not found: ${cmd}`);
        newOutput.push("Type 'help' to see available commands.");
        newOutput.push("");
    }
    
    setOutput(newOutput);
    setCommand("");
    setTabSuggestions([]);
    setShowSuggestions(false);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle up/down arrow for history navigation
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0 && historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCommand(history[history.length - 1 - newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCommand(history[history.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCommand("");
      }
    } 
    // Handle tab for autocomplete
    else if (e.key === "Tab") {
      e.preventDefault();
      
      if (showSuggestions && tabSuggestions.length > 0) {
        // Cycle through suggestions
        const newIndex = (suggestionIndex + 1) % tabSuggestions.length;
        setSuggestionIndex(newIndex);
        setCommand(tabSuggestions[newIndex]);
      } else {
        // Generate suggestions
        const cmdParts = command.split(" ");
        const currentWord = cmdParts[cmdParts.length - 1].toLowerCase();
        
        if (cmdParts.length === 1) {
          // Command completion
          const suggestions = Object.keys(commands).filter(cmd => 
            cmd.startsWith(currentWord)
          );
          
          if (suggestions.length === 1) {
            // Only one suggestion, autocomplete
            setCommand(suggestions[0]);
          } else if (suggestions.length > 1) {
            // Multiple suggestions, show them
            setTabSuggestions(suggestions);
            setShowSuggestions(true);
            setSuggestionIndex(0);
            setCommand(suggestions[0]); // Select first suggestion
          }
        } else if (cmdParts[0] === "cat" || cmdParts[0] === "cd") {
          // File/directory completion
          const files = ["about.txt", "projects.txt", "skills.txt", "contact.txt", "games/", "src/"];
          const suggestions = files.filter(file => 
            file.startsWith(currentWord)
          );
          
          if (suggestions.length === 1) {
            // Only one suggestion, autocomplete
            cmdParts[cmdParts.length - 1] = suggestions[0];
            setCommand(cmdParts.join(" "));
          } else if (suggestions.length > 1) {
            // Multiple suggestions, show them
            setTabSuggestions(suggestions);
            setShowSuggestions(true);
            setSuggestionIndex(0);
            cmdParts[cmdParts.length - 1] = suggestions[0]; // Select first suggestion
            setCommand(cmdParts.join(" "));
          }
        }
      }
    } else {
      // Any other key press hides suggestions
      setShowSuggestions(false);
    }
  };
  
  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100">
      <ThreeBackground />
      
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          <h1 className="title-text text-6xl mb-8 flex items-center gap-4">
            <TerminalIcon size={48} />
            <span>TERMINAL</span>
          </h1>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="w-full max-w-4xl"
          >
            <div className="glass rounded-lg overflow-hidden">
              <div className="bg-slate-800 dark:bg-slate-900 px-4 py-2 flex items-center">
                <div className="flex gap-2 mr-4">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-white font-mono text-sm">visitor@portfolio:~</div>
              </div>
              
              <div 
                ref={outputRef}
                className="bg-slate-900 text-green-300 p-4 h-96 overflow-y-auto font-mono text-sm terminal-scrollbar"
                onClick={() => inputRef.current?.focus()}
              >
                {output.map((line, i) => (
                  <div key={i} className="terminal-line whitespace-pre-wrap">
                    {line}
                  </div>
                ))}

                <form onSubmit={handleCommand} className="flex items-center gap-2 mt-2">
                  <span className="text-green-500">{">"}</span>
                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={command}
                      onChange={(e) => setCommand(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="w-full bg-transparent outline-none text-green-300 caret-transparent"
                      autoFocus
                      spellCheck="false"
                    />
                    <span className="absolute left-0 top-0 pointer-events-none">
                      {command}
                      {cursorVisible && <span className="text-green-500 animate-pulse">▋</span>}
                    </span>
                  </div>
                </form>
                
                {showSuggestions && tabSuggestions.length > 0 && (
                  <div className="mt-2 p-2 bg-slate-800 rounded">
                    <div className="text-xs text-slate-400 mb-1">Tab suggestions:</div>
                    <div className="flex flex-wrap gap-2">
                      {tabSuggestions.map((suggestion, i) => (
                        <span 
                          key={i} 
                          className={`px-2 py-1 rounded ${i === suggestionIndex ? 'bg-green-800 text-white' : 'bg-slate-700'}`}
                        >
                          {suggestion}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
              <p>Type 'help' to see available commands. Try using Tab for autocomplete!</p>
              <p className="mt-1">Your command history is saved between visits. Type 'clearhistory' to reset it.</p>
            </div>
          </motion.div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}