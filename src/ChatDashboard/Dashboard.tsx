// import { useState, useEffect, useRef } from 'react';
// import {
//   useAccount,
//   useReadContract,
//   useWriteContract,
//   useWaitForTransactionReceipt
// } from 'wagmi';
// import { toast } from 'sonner';
// import { registryAbi } from '../../src/config/abi';

// const REGISTRY_ADDRESS = '0x6E1B759148023E90414767F8c7C393eF0dE70a9C';

// export default function ChatDashboard() {
//   const { address, isConnected } = useAccount();
//   const { writeContract: sendMsgContract } = useWriteContract();
//   const [ensName, setEnsName] = useState('');
//   const [inbox, setInbox] = useState([]);
//   const [recipient, setRecipient] = useState('');
//   const [text, setText] = useState('');
//   const [sendTxHash, setSendTxHash] = useState(null);
//   const scrollRef = useRef();

//   // 1) Fetch logged-in user's .cosmos name
//   useEffect(() => {
//     if (!address) return;
//     (async () => {
//       try {
//         const name = await useReadContract({
//           address: REGISTRY_ADDRESS,
//           abi: registryAbi,
//           functionName: 'getMyName',
//           account: address
//         });
//         setEnsName(name || '');
//       } catch (e) {
//         console.error(e);
//       }
//     })();
//   }, [address]);

//   // 2) Load inbox for that name
//   useEffect(() => {
//     if (!ensName) return;
//     (async () => {
//       try {
//         const raw = await useReadContract({
//           address: REGISTRY_ADDRESS,
//           abi: registryAbi,
//           functionName: 'getInbox',
//           args: [ensName]
//         });
//         // raw is ChatMessage[]: [fromName, toName, message, timestamp][]
//         const msgs = raw.map(m => ({
//           from: m.fromName,
//           to: m.toName,
//           text: m.message,
//           time: new Date(m.timestamp.toNumber() * 1000)
//         }));
//         setInbox(msgs);
//         // scroll to bottom
//         scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
//       } catch (e) {
//         console.error(e);
//       }
//     })();
//   }, [ensName, sendTxHash]);

//   // 3) Watch for sendMessage tx confirmation
//   const { isSuccess: sendConfirmed } = useWaitForTransactionReceipt({
//     hash: sendTxHash,
//     query: { enabled: !!sendTxHash }
//   });

//   useEffect(() => {
//     if (sendConfirmed) {
//       toast.success('Message sent!');
//       setText('');
//       // re-fetch triggered by sendTxHash change
//     }
//   }, [sendConfirmed]);

//   const handleSend = async () => {
//     if (!recipient || !text.trim()) {
//       toast.error('Enter recipient and message');
//       return;
//     }
//     try {
//       const tx = await sendMsgContract({
//         address: REGISTRY_ADDRESS,
//         abi: registryAbi,
//         functionName: 'sendMessage',
//         args: [recipient, text],
//         account: address
//       });
//       toast.info('Sending message…');
//       setSendTxHash(tx);
//     } catch (e) {
//       console.error(e);
//       toast.error('Failed to send');
//     }
//   };

//   if (!isConnected) {
//     return <p className="text-center mt-8">Connect your wallet to access chat.</p>;
//   }

//   if (!ensName) {
//     return (
//       <p className="text-center mt-8">
//         You need to register a <code>.cosmos</code> name before chatting.
//       </p>
//     );
//   }

//   return (
//     <div className="flex flex-col h-[80vh] max-w-lg mx-auto bg-gray-50 rounded-lg shadow-lg">
//       <header className="p-4 bg-white border-b text-center font-semibold">
//         Chat as <span className="text-indigo-600">{ensName}.cosmos</span>
//       </header>

//       <div className="flex-1 overflow-y-auto p-4 space-y-3">
//         {inbox.map((msg, i) => (
//           <div
//             key={i}
//             className={`flex ${msg.from === ensName ? 'justify-end' : 'justify-start'}`}
//           >
//             <div
//               className={`max-w-xs px-3 py-2 rounded-lg ${
//                 msg.from === ensName
//                   ? 'bg-green-500 text-white'
//                   : 'bg-white text-gray-800'
//               }`}
//             >
//               <div className="text-xs font-bold">{msg.from}</div>
//               <div className="mt-1">{msg.text}</div>
//               <div className="text-[10px] text-gray-400 mt-1">
//                 {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//               </div>
//             </div>
//           </div>
//         ))}
//         <div ref={scrollRef} />
//       </div>

//       <footer className="p-3 bg-white border-t flex items-center gap-2">
//         <input
//           type="text"
//           placeholder="recipient.cosmos"
//           value={recipient}
//           onChange={(e) => setRecipient(e.target.value.trim())}
//           className="w-2/5 px-3 py-2 border rounded-full focus:outline-none"
//         />
//         <input
//           type="text"
//           placeholder="Type a message"
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           className="flex-1 px-3 py-2 border rounded-full focus:outline-none"
//         />
//         <button
//           onClick={handleSend}
//           className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600"
//         >
//           Send
//         </button>
//       </footer>
//     </div>
//   );
// }
