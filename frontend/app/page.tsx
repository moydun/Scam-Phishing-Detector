'use client';

import React, { useState } from 'react';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export default function Home() {
  // Состояния для интерактивности (чтобы кнопки работали)
  const [urlInput, setUrlInput] = useState('');
  const [result, setResult] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [username, setUsername] = useState('');
  const [history, setHistory] = useState<any[]>([]);

  const handleCheck = async () => {
    if (!urlInput.trim()) return;

    setIsSearching(true);
    setResult(null);

    try {
      const response = await fetch(`${BACKEND_URL}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: urlInput.trim() }),
      });

      if (!response.ok) throw new Error('Server error');

      const data = await response.json();

      const finalResult = {
        url: urlInput.trim(),
        status: data.verdict || 'UNKNOWN',
        reason: data.explanation || 'Анализ завершён.',
        risk: data.risk_level === 'HIGH' ? '90%' : data.risk_level === 'MEDIUM' ? '50%' : '10%',
        virustotal: data.virustotal,
        whois: data.whois,
      };

      setResult(finalResult);

      if (isLoggedIn) {
        setHistory((prev: any[]) => [{ url: urlInput.trim(), status: finalResult.status, date: 'Сегодня, ' + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }, ...prev]);
      }
    } catch {
      setResult({
        url: urlInput.trim(),
        status: 'UNKNOWN',
        reason: 'Не удалось связаться с сервером. Проверьте подключение.',
        risk: '—',
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Логика фейкового входа
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      setIsLoggedIn(true);
      setShowLoginModal(false);
      // Заполняем дефолтную историю для демонстрации судьям
      setHistory([
        { url: 'steam-community-safe.ru', status: 'SCAM', date: 'Вчера, 18:24' },
        { url: 'wikipedia.org', status: 'SAFE', date: '20 мая, 14:10' }
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans">
      
      {/* ХЕДЕР (ШАПКА САЙТА) */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🛡️</span>
            <h1 className="text-xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">
              ScamShield
            </h1>
          </div>
          
          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex space-x-6 text-sm font-medium text-slate-400">
              <a href="#" className="hover:text-red-400 transition-colors">Главная</a>
              <a href="#history-section" className="hover:text-red-400 transition-colors">История</a>
            </nav>

            {/* Рабочая кнопка Логина */}
            {isLoggedIn ? (
              <div className="flex items-center space-x-3 bg-slate-900 border border-slate-800 px-4 py-1.5 rounded-full text-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-slate-300 font-medium">{username}</span>
                <button onClick={() => { setIsLoggedIn(false); setHistory([]); }} className="text-xs text-red-400 hover:underline pl-2 border-l border-slate-800">Выйти</button>
              </div>
            ) : (
              <button 
                onClick={() => setShowLoginModal(true)}
                className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-sm font-semibold px-4 py-2 rounded-xl transition-all"
              >
                Войти / Регистрация
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ГЛАВНЫЙ КОНТЕНТ */}
      <main className="max-w-4xl mx-auto px-4 py-12 flex-grow flex flex-col items-center justify-center text-center">
        
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
          Проверь ссылку на <span className="text-red-500 underline decoration-wavy decoration-1">фишинг</span> и скам
        </h2>
        <p className="text-slate-400 max-w-xl mb-8 text-sm md:text-base">
          Наш ИИ-ассистент мгновенно проанализирует подозрительный URL-адрес и защитит твои данные.
        </p>

        {/* ФОРМА ВВОДА (Поисковая строка) */}
        <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-2 flex items-center shadow-2xl focus-within:border-red-500 transition-all duration-300 mb-8">
          <input 
            type="text" 
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Вставьте подозрительную ссылку сюда... (например, instagram-security.com)" 
            className="w-full bg-transparent px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none text-sm md:text-base"
          />
          <button 
            onClick={handleCheck}
            disabled={isSearching}
            className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-md active:scale-95 text-sm md:text-base whitespace-nowrap disabled:opacity-50"
          >
            {isSearching ? 'Анализ ИИ...' : 'Проверить'}
          </button>
        </div>

        {/* ЭКРАН РЕЗУЛЬТАТА ПРОВЕРКИ */}
        {isSearching && (
          <div className="w-full max-w-2xl bg-slate-900/60 border border-slate-800 rounded-2xl p-8 animate-pulse text-center">
            <div className="text-3xl mb-2 animate-spin inline-block">⏳</div>
            <p className="text-slate-300 font-medium">ИИ сканирует контент страницы, проверяет SSL-сертификаты и базы данных...</p>
          </div>
        )}

        {result && !isSearching && (
          <div className={`w-full max-w-2xl border rounded-2xl p-6 text-left shadow-2xl transition-all duration-500 ${
            result.status === 'SCAM' ? 'bg-red-950/30 border-red-900/80' : 
            result.status === 'SAFE' ? 'bg-emerald-950/30 border-emerald-900/80' : 'bg-amber-950/30 border-amber-900/80'
          }`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xs font-mono text-slate-500 block mb-1">ПРОВЕРЕННЫЙ URL</span>
                <span className="text-lg font-bold font-mono text-slate-200">{result.url}</span>
              </div>
              <span className={`px-3 py-1.5 rounded-xl text-xs font-bold tracking-wider ${
                result.status === 'SCAM' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 
                result.status === 'SAFE' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}>
                {result.status === 'SCAM' ? '❌ СКАМ / ФИШИНГ' : result.status === 'SAFE' ? '✅ БЕЗОПАСНО' : '⚠️ ПОДОЗРИТЕЛЬНО'}
              </span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">{result.reason}</p>
            <div className="border-t border-slate-800/80 pt-3 flex justify-between text-xs text-slate-400">
              <span>Вероятность угрозы: <strong className={result.status === 'SCAM' ? 'text-red-400' : 'text-emerald-400'}>{result.risk}</strong></span>
              {!isLoggedIn && <span className="text-amber-400/80">💡 Войдите в аккаунт, чтобы сохранить этот результат</span>}
            </div>
          </div>
        )}

        {/* БЛОК ИСТОРИИ (Показывается после логина) */}
        <div id="history-section" className="w-full max-w-2xl mt-12 text-left">
          <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center space-x-2">
            <span>📋</span> 
            <span>История проверок аккаунта</span>
          </h3>
          
          {isLoggedIn ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl divide-y divide-slate-800/60">
              {history.length > 0 ? (
                history.map((item, index) => (
                  <div key={index} className="p-4 flex justify-between items-center text-sm">
                    <span className="font-mono text-slate-300 truncate max-w-[250px] md:max-w-[400px]">{item.url}</span>
                    <div className="flex items-center space-x-4">
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        item.status === 'SCAM' ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'
                      }`}>{item.status}</span>
                      <span className="text-xs text-slate-500">{item.date}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="p-6 text-center text-sm text-slate-500">Вы пока не проверили ни одной ссылки в этом сеансе.</p>
              )}
            </div>
          ) : (
            <div className="bg-slate-900/30 border border-slate-800/40 rounded-xl p-6 text-center">
              <p className="text-sm text-slate-500 mb-3">История проверок доступна только авторизованным пользователям.</p>
              <button 
                onClick={() => setShowLoginModal(true)}
                className="text-xs font-semibold text-red-400 hover:text-red-300 transition-colors"
              >
                Войти в аккаунт сейчас →
              </button>
            </div>
          )}
        </div>

      </main>

      {/* МОДАЛЬНОЕ ОКНО ЛОГИНА (ВСПЛЫВАЮЩЕЕ) */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-100">Вход в ScamShield</h3>
              <button onClick={() => setShowLoginModal(false)} className="text-slate-400 hover:text-slate-200 text-xl">✕</button>
            </div>
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Имя пользователя / Email</label>
                <input 
                  type="text" 
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Например, it_student" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-red-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Пароль</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-red-500 text-sm"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold py-3 rounded-xl hover:from-red-500 hover:to-orange-400 transition-all text-sm mt-2"
              >
                Создать аккаунт и войти
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ФУТЕР */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-600">
        <p>© 2026 ScamShield. Разработано на хакатоне AI-Менеджмента.</p>
      </footer>

    </div>
  );
}