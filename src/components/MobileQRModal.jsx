import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, X, Smartphone, Wifi, Copy, Check, ShieldAlert, ArrowRight, Radio, ExternalLink } from 'lucide-react';

export default function MobileQRModal({ isOpen, onClose }) {
  const [selectedIP, setSelectedIP] = useState('192.168.7.3');
  const [dynamicIPs, setDynamicIPs] = useState([
    { label: 'Wi-Fi Network (Primary Active IP: 192.168.7.3)', ip: '192.168.7.3' },
    { label: 'Wi-Fi Network (Alternate IP: 192.168.137.23)', ip: '192.168.137.23' },
    { label: 'Laptop Mobile Hotspot Adapter', ip: '192.168.137.1' },
    { label: 'Localhost (Laptop Only)', ip: 'localhost' }
  ]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const apiHost = window.location.hostname || 'localhost';
      fetch(`http://${apiHost}:3001/api/server-info`)
        .then(res => res.json())
        .then(data => {
          const list = [];
          if (data.tunnelUrl) {
            list.push({
              label: '🌟 Public Web Access (Recommended — Works on Any Mobile 4G/5G/Wi-Fi)',
              ip: data.tunnelUrl,
              isFullUrl: true
            });
          }
          if (data && data.localIPs && data.localIPs.length > 0) {
            data.localIPs.forEach(ip => {
              list.push({
                label: `Local Network Adapter (${ip})`,
                ip: ip,
                isFullUrl: false
              });
            });
          }
          list.push({ label: 'Localhost (Laptop Only)', ip: 'localhost', isFullUrl: false });
          setDynamicIPs(list);

          if (data.tunnelUrl) {
            setSelectedIP(data.tunnelUrl);
          } else if (data.localIPs && data.localIPs.length > 0) {
            const wifiIP = data.localIPs.find(ip => ip.startsWith('192.168.')) || data.localIPs[0];
            setSelectedIP(wifiIP);
          }
        })
        .catch(() => {
          setSelectedIP('192.168.7.3');
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentOption = dynamicIPs.find(item => item.ip === selectedIP);
  const targetUrl = currentOption?.isFullUrl ? selectedIP : (selectedIP.startsWith('http') ? selectedIP : `http://${selectedIP}:3001`);

  const handleCopy = () => {
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="bg-[#0e1126] border border-purple-500/40 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-purple-950 to-slate-900 border-b border-purple-500/20 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-600/20 text-purple-400 rounded-xl border border-purple-500/30">
              <QrCode size={22} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Mobile QR Code Access
              </h3>
              <p className="text-xs text-purple-300/70">Instant Zero-Installation Smartphone Terminal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg transition"
            title="Close Modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-center">
          {/* Vector SVG QR Code Card */}
          <div className="p-5 bg-[#070814] border-2 border-purple-500/40 rounded-3xl inline-block shadow-2xl mx-auto relative group">
            <div className="p-4 bg-white rounded-2xl shadow-inner">
              <QRCodeSVG
                value={targetUrl}
                size={210}
                bgColor={"#ffffff"}
                fgColor={"#070814"}
                level={"M"}
                includeMargin={false}
              />
            </div>
            <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-purple-300 font-mono font-bold">
              <Radio size={14} className="text-purple-400 animate-pulse" /> {targetUrl}
            </div>
          </div>

          {/* Network Interface Selection */}
          <div className="text-left space-y-2">
            <label className="block text-xs font-bold text-purple-200 uppercase tracking-wider flex items-center gap-1.5">
              <Wifi size={14} className="text-purple-400" /> Select Network Adapter IP:
            </label>
            <select
              value={selectedIP}
              onChange={(e) => setSelectedIP(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#070814] border border-slate-700 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-purple-500"
            >
              {dynamicIPs.map((net, idx) => (
                <option key={idx} value={net.ip}>
                  {net.isFullUrl ? net.ip : `http://${net.ip}:3000`} — {net.label}
                </option>
              ))}
            </select>
          </div>

          {/* Step-by-Step Instructions */}
          <div className="p-4 bg-purple-950/30 border border-purple-500/20 rounded-2xl text-left space-y-2.5 text-xs">
            <h4 className="font-bold text-white flex items-center gap-2">
              <Smartphone size={16} className="text-purple-400" /> How to Launch on Your Smartphone:
            </h4>
            <ol className="space-y-1.5 text-slate-300 list-decimal list-inside leading-relaxed">
              <li>Connect your mobile phone to the <strong>same Wi-Fi network</strong> as your laptop.</li>
              <li>Open your phone's native <strong>Camera app</strong> (iOS Camera or Android Google Lens / QR Scanner).</li>
              <li>Point phone camera at the QR code above.</li>
              <li>Tap the pop-up banner link (<strong className="text-purple-300 font-mono">{targetUrl}</strong>) to open the mobile app instantly.</li>
            </ol>

            <p className="text-[11px] text-amber-300/90 pt-1 border-t border-purple-500/20">
              💡 <em>If Wi-Fi isolation blocks connection: Turn on your laptop's Mobile Hotspot, connect your phone to it, and select <strong>192.168.137.1</strong> in the dropdown above.</em>
            </p>
          </div>

          {/* Direct Link Share & Copy */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={targetUrl}
              className="w-full px-3.5 py-2.5 bg-[#070814] border border-slate-800 rounded-xl text-xs font-mono text-purple-300"
            />
            <button
              onClick={handleCopy}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 shadow"
            >
              {copied ? <Check size={16} className="text-emerald-300" /> : <Copy size={16} />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
            <a
              href={targetUrl}
              target="_blank"
              rel="noreferrer"
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-purple-300 rounded-xl transition"
              title="Open Link in New Tab"
            >
              <ExternalLink size={16} />
            </a>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#070814] border-t border-slate-800 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs shadow-lg"
          >
            Close QR Modal
          </button>
        </div>
      </div>
    </div>
  );
}
