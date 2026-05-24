'use client';

import React, { useState } from 'react';

// СЛОВАРЬ ПЕРЕВОДОВ (RU / KG)
const TRANSLATIONS: any = {
  ru: {
    logo: 'Scam',
    logoSub: 'Shield',
    themeLight: '☀️ Светлая',
    themeDark: '🌙 Тёмная',
    cabinet: 'Личный кабинет',
    logout: 'Выйти',
    badge: 'ИИ Мониторинг Безопасности',
    title: 'Проверить ссылку на фишинг',
    desc: 'Мгновенный разбор структуры сайта, SSL-протоколов и контента с помощью нейросети ATLAS.',
    placeholder: 'Вставьте адрес сайта сюда... (например, instagram-security.com)',
    btnCheck: 'Запустить тест',
    btnChecking: 'Анализирую...',
    searching: 'Нейросеть проверяет серверные логи, доменные записи и паттерны обмана...',
    target: 'Цель проверки',
    cat: 'Категория',
    risk: 'Вероятность атаки',
    historyTitle: 'Журнал инцидентов аккаунта',
    historyEmpty: 'Войдите, чтобы вести автоматический учет и логирование проверок.',
    sosTitle: '🚨 Куда обращаться, если вас обманули?',
    sosDesc: 'Если вы уже ввели данные карты или отправили деньги, действуйте мгновенно:',
    sosMvd: 'Служба 102',
    sosMvdSub: 'МВД Киберполиция',
    sosTg: 'Telegram Бот',
    sosTgSub: 'Подать жалобу на скам',
    sosBank: 'Ваш Банк',
    sosBankSub: 'Блокировка карт 24/7',
    chatTitle: 'Консультант ATLAS AI',
    chatPlaceholder: 'Спроси у ATLAS (например: выиграла приз)...',
    chatSend: 'Отправить',
    modalTitleLogin: 'Вход в ScamShield',
    modalTitleReg: 'Регистрация в ScamShield',
    modalTabLogin: 'Вход',
    modalTabReg: 'Регистрация',
    labelLogin: 'Логин / Email',
    labelPass: 'Пароль',
    labelPassConfirm: 'Повторите пароль',
    btnCancel: 'Отмена',
    btnLogin: 'Авторизоваться',
    btnReg: 'Создать аккаунт',
    footer: '© 2026 ScamShield. Разработано на хакатоне AI-Менеджмента.',
    botWelcome: 'Привет! Я ИИ-помощник ATLAS. Столкнулся с подозрительным сайтом или звонком? Напиши мне, я разберусь!',
    botReplyDefault: 'Интересный запрос. Наш алгоритм ATLAS рекомендует никогда не вводить личные данные и СМС-коды на сайтах, полученных из сомнительных сообщений.',
    botReplyBank: '🚨 Похоже на вишинг (телефонный скам). Положите трубку и перезвоните по официальному номеру банка, указанному на вашей карте!',
    botReplyPrize: '🎁 Внимание: бесплатные розыгрыши с требованием "оплатить комиссию для конвертации" — это 100% скам.'
  },
  kg: {
    logo: 'Scam',
    logoSub: 'Shield',
    themeLight: '☀️ Жарык',
    themeDark: '🌙 Караңгы',
    cabinet: 'Жеке кабинет',
    logout: 'Чыгуу',
    badge: 'ЖИ Коопсуздук Мониторинги',
    title: 'Шилтемени фишингке текшерүү',
    desc: 'ATLAS нейротармагынын жардамы менен сайттын структурасын, SSL-протоколдорун жана мазмунун заматта талдоо.',
    placeholder: 'Сайттын дарегин бул жерге чаптаңыз... (мисалы, instagram-security.com)',
    btnCheck: 'Текшерүүнү баштоо',
    btnChecking: 'Талдап жатам...',
    searching: 'Нейротармак сервердик логдорду, домендик жазууларды жана алдамчылык үлгүлөрүн текшерүүдө...',
    target: 'Текшерүү объектиси',
    cat: 'Категория',
    risk: 'Чабуулдун ыктымалдуулугу',
    historyTitle: 'Аккаунттун окуялар журналы',
    historyEmpty: 'Текшерүүлөрдү автоматтык түрдө эсепке алуу жана журналга киргизүү үчүн кириңиз.',
    sosTitle: '🚨 Эгерде сизди алдап кетишсе, кайда кайрылуу керек?',
    sosDesc: 'Эгер сиз картанын маалыматтарын киргизип же акча жөнөткөн болсоңуз, тез арада аракеттениңиз:',
    sosMvd: '102 кызматы',
    sosMvdSub: 'ИИМ Киберполиция',
    sosTg: 'Telegram Бот',
    sosTgSub: 'Скамга даттануу берүү',
    sosBank: 'Сиздин Банк',
    sosBankSub: 'Карталарды блоктоо 24/7',
    chatTitle: 'ATLAS AI Кеңешчиси',
    chatPlaceholder: 'ATLASтан сураңыз (мисалы: байге уттум)...',
    chatSend: 'Жөнөтүү',
    modalTitleLogin: 'ScamShield\'ге кирүү',
    modalTitleReg: 'ScamShield\'де катталуу',
    modalTabLogin: 'Кирүү',
    modalTabReg: 'Катталуу',
    labelLogin: 'Логин / Email',
    labelPass: 'Сөз айкашы (Пароль)',
    labelPassConfirm: 'Паролду кайталаңыз',
    btnCancel: 'Жокко чыгаруу',
    btnLogin: 'Авторизациялоо',
    btnReg: 'Аккаунт түзүү',
    footer: '© 2026 ScamShield. AI-Менеджмент хакатонунда иштелип чыккан.',
    botWelcome: 'Салам! Мен ATLAS жасалма интеллект жардамчысымын. Шектүү сайт же чалууга туш болдуңузбу? Мага жазыңыз, мен жардам берем!',
    botReplyDefault: 'Кызыктуу суроо. Биздин ATLAS алгоритмибиз шектүү билдирүүлөрдөн алынган сайттарга жеке маалыматтарды жана СМС-коддорду эч качан киргизбөөнү сунуштайт.',
    botReplyBank: '🚨 Бул вишингге (телефондук скам) окшош. Түтүктү коюп, картаңызда көрсөтүлгөн банктын расмий номерине чалыңыз!',
    botReplyPrize: '🎁 Көңүл буруңуз: "айландыруу үчүн комиссия төлөө" талабы менен акысыз утуштар — бул 100% скам.'
  }
};

const FAKE_SCAM_DATABASE = [
  { url: 'instagram-security.com', status: 'SCAM', reasonRu: 'Фишинговый клон соцсети. Пытается украсть пароли через поддельную форму входа.', reasonKg: 'Социалдык тармактын фишингдик клону. Жасалма кирүү формасы аркылуу сырсөздөрдү уурдоого аракет кылат.', risk: '98%', typeRu: 'Социальные сети', typeKg: 'Социалдык тармактар' },
  { url: 'crypto-gift-giveaway.net', status: 'SCAM', reasonRu: 'Мошеннический сайт с раздачей криптовалюты. Требует тестовый платеж.', reasonKg: 'Криптовалюта тараткан алдамчылык сайт. Сыноо төлөмүн талап кылат.', risk: '95%', typeRu: 'Криптовалюта', typeKg: 'Криптовалюта' },
  { url: 'google.com', status: 'SAFE', reasonRu: 'Официальный проверенный домен Google LLC. Вредоносной активности не обнаружено.', reasonKg: 'Google LLC расмий текшерилген домени. Зыяндуу аракеттер табылган жок.', risk: '0%', typeRu: 'Поисковые системы', typeKg: 'Издөө системалары' },
  { url: 'github.com', status: 'SAFE', reasonRu: 'Официальный репозиторий GitHub Inc. Безопасно для использования.', reasonKg: 'GitHub Inc расмий репозиторийи. Колдонуу үчүн коопсуз.', risk: '1%', typeRu: 'Разработка', typeKg: 'Иштеп чыгуу' },
];

export default function Home() {
  // Базовые состояния
  const [lang, setLang] = useState<'ru' | 'kg'>('ru');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  
  const [urlInput, setUrlInput] = useState('');
  const [result, setResult] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [history, setHistory] = useState<any[]>([]);

  // Состояния для ИИ-чата
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<any[]>([
    { sender: 'bot', text: TRANSLATIONS[lang].botWelcome }
  ]);

  const t = TRANSLATIONS[lang];

  const handleCheck = () => {
    if (!urlInput.trim()) return;
    setIsSearching(true);
    setResult(null);

    setTimeout(() => {
      const cleanUrl = urlInput.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
      const found = FAKE_SCAM_DATABASE.find(item => item.url.includes(cleanUrl));

      const finalResult = found || {
        url: cleanUrl,
        status: 'SUSPICIOUS',
        reasonRu: 'Новый или малоизвестный домен. Наш ИИ заметил подозрительную структуру текста или отсутствие SSL.',
        reasonKg: 'Жаңы же аз белгилүү домен. Биздин ЖИ шектүү текст структурасын же SSL жоктугун байкады.',
        risk: '65%',
        typeRu: 'Неизвестно',
        typeKg: 'Белгисиз'
      };

      setResult(finalResult);
      setIsSearching(false);

      if (isLoggedIn) {
        setHistory(prev => [{ url: cleanUrl, status: finalResult.status, date: lang === 'ru' ? 'Сегодня' : 'Бүгүн' }, ...prev]);
      }
    }, 1500);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      setIsLoggedIn(true);
      setShowLoginModal(false);
      setHistory([
        { url: 'steam-community-safe.ru', status: 'SCAM', date: lang === 'ru' ? 'Вчера' : 'Кечээ' },
        { url: 'wikipedia.org', status: 'SAFE', date: '20.05' }
      ]);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');

    setTimeout(() => {
      let reply = t.botReplyDefault;
      if (userMsg.toLowerCase().includes('звонок') || userMsg.toLowerCase().includes('банк') || userMsg.toLowerCase().includes('чалуу')) {
        reply = t.botReplyBank;
      } else if (userMsg.toLowerCase().includes('выигрыш') || userMsg.toLowerCase().includes('приз') || userMsg.toLowerCase().includes('утуш')) {
        reply = t.botReplyPrize;
      }
      setChatMessages(prev => [...prev, { sender: 'bot', text: reply }]);
    }, 1000);
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between font-sans transition-colors duration-300 ${
      isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-[#F8FAFC] text-slate-900'
    }`}>
      
      {/* ХЕДЕР */}
      <header className={`border-b sticky top-0 z-40 shadow-sm backdrop-blur-md transition-colors duration-300 ${
        isDarkMode ? 'border-slate-800 bg-slate-950/80' : 'border-slate-200 bg-white/80'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          
          {/* Логотип */}
          <div className="flex items-center space-x-2">
            <span className="text-3xl text-blue-600">🛡️</span>
            <h1 className="text-2xl font-black tracking-tight">
              {t.logo}<span className="text-blue-600">{t.logoSub}</span>
            </h1>
          </div>
          
          {/* Панель управления (Тема, Язык, Кабинет) */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            
            {/* Переключатель темы */}
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`text-xs font-bold px-3 py-2 rounded-xl border transition-all ${
                isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {isDarkMode ? t.themeLight : t.themeDark}
            </button>

            {/* Переключатель языка */}
            <div className={`flex rounded-xl p-0.5 border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
              <button 
                onClick={() => setLang('ru')} 
                className={`text-xs font-black px-2.5 py-1.5 rounded-lg transition-all ${lang === 'ru' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
              >
                RU
              </button>
              <button 
                onClick={() => setLang('kg')} 
                className={`text-xs font-black px-2.5 py-1.5 rounded-lg transition-all ${lang === 'kg' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
              >
                KG
              </button>
            </div>

            {/* Авторизация */}
            {isLoggedIn ? (
              <div className={`flex items-center space-x-2 border px-3 py-1.5 rounded-xl text-xs font-semibold ${
                isDarkMode ? 'bg-blue-950/40 border-blue-900/50 text-blue-300' : 'bg-blue-50 border-blue-100 text-blue-900'
              }`}>
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                <span>{username}</span>
                <button onClick={() => { setIsLoggedIn(false); setHistory([]); }} className="text-red-500 hover:underline pl-2 border-l border-blue-200">{t.logout}</button>
              </div>
            ) : (
              <button 
                onClick={() => { setAuthMode('login'); setShowLoginModal(true); }}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md shadow-blue-500/10"
              >
                {t.cabinet}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ОСНОВНАЯ СЕТКА ИНТЕРФЕЙСА */}
      <div className="max-w-7xl w-full mx-auto px-6 py-8 flex-grow grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ЛЕВАЯ И СРЕДНЯЯ КОЛОНКА */}
        <div className="lg:col-span-2 space-y-8 flex flex-col justify-start">
          
          {/* КАРТОЧКА СКАНЕРА */}
          <div className={`border rounded-3xl p-6 md:p-8 shadow-xl transition-all duration-300 ${
            isDarkMode ? 'bg-slate-900 border-slate-800 shadow-none' : 'bg-white border-slate-200/80 shadow-slate-200/50'
          }`}>
            <div className="text-center md:text-left mb-6">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 dark:bg-blue-950/50 px-3 py-1 rounded-full">
                {t.badge}
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight mt-3 mb-2">{t.title}</h2>
              <p className="text-slate-400 text-sm">{t.desc}</p>
            </div>

            {/* Строка поиска */}
            <div className={`border rounded-2xl p-2 flex flex-col md:flex-row items-center gap-2 transition-all shadow-inner mb-6 ${
              isDarkMode ? 'bg-slate-950 border-slate-800 focus-within:border-blue-600' : 'bg-slate-50 border-slate-200 focus-within:border-blue-500 focus-within:bg-white'
            }`}>
              <input 
                type="text" 
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder={t.placeholder} 
                className={`w-full bg-transparent px-4 py-3 focus:outline-none text-sm md:text-base font-mono ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}
              />
              <button 
                onClick={handleCheck}
                disabled={isSearching}
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-xl transition-all active:scale-95 text-sm md:text-base shadow-lg shadow-blue-500/20 whitespace-nowrap disabled:opacity-50"
              >
                {isSearching ? t.btnChecking : t.btnCheck}
              </button>
            </div>

            {/* ЭКРАН ЗАГРУЗКИ */}
            {isSearching && (
              <div className={`border rounded-2xl p-8 text-center space-y-3 ${isDarkMode ? 'bg-slate-950/50 border-slate-800' : 'bg-blue-50/50 border-blue-100'}`}>
                <div className="w-10 h-10 border-4 border-t-blue-600 border-slate-200 rounded-full animate-spin mx-auto"></div>
                <p className="text-sm font-semibold text-blue-600">{t.searching}</p>
              </div>
            )}

            {/* ВЕРДИКТ */}
            {result && !isSearching && (
              <div className={`border rounded-2xl p-6 text-left shadow-md transition-all duration-300 ${
                result.status === 'SCAM' ? 'bg-red-500/5 border-red-500/30' : 
                result.status === 'SAFE' ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-amber-500/5 border-amber-500/30'
              }`}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 border-b border-slate-800/20 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">{t.target}</span>
                    <span className="text-base font-bold font-mono">{result.url}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-xl text-xs font-bold font-mono tracking-wider ${
                    result.status === 'SCAM' ? 'bg-red-100 text-red-700' : 
                    result.status === 'SAFE' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {result.status === 'SCAM' ? '❌ SCAM' : result.status === 'SAFE' ? '🛡️ SAFE' : '⚡ WARNING'}
                  </span>
                </div>
                <p className="text-sm leading-relaxed mb-4">{lang === 'ru' ? result.reasonRu : result.reasonKg}</p>
                <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
                  <span>{t.cat}: <strong className="text-slate-500">{lang === 'ru' ? result.typeRu : result.typeKg}</strong></span>
                  <span>{t.risk}: <strong className={result.status === 'SCAM' ? 'text-red-500' : 'text-emerald-500'}>{result.risk}</strong></span>
                </div>
              </div>
            )}
          </div>

          {/* ЖУРНАЛ ИНЦИДЕНТОВ */}
          <div className={`border rounded-3xl p-6 shadow-sm ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80'}`}>
            <h3 className="text-md font-bold mb-3 flex items-center space-x-2">
              <span>📋</span> <span>{t.historyTitle}</span>
            </h3>
            {isLoggedIn ? (
              <div className={`divide-y border rounded-xl overflow-hidden ${isDarkMode ? 'divide-slate-800 border-slate-800' : 'divide-slate-100 border-slate-100'}`}>
                {history.map((item, index) => (
                  <div key={index} className={`p-3 flex justify-between items-center text-xs ${isDarkMode ? 'bg-slate-950/30' : 'bg-slate-50/30'}`}>
                    <span className="font-mono truncate max-w-[200px] md:max-w-sm">{item.url}</span>
                    <span className={`px-2 py-0.5 rounded font-bold ${item.status === 'SCAM' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>{item.status}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-4">{t.historyEmpty}</p>
            )}
          </div>

          {/* SOS КНОПКИ */}
          <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white rounded-3xl p-6 shadow-lg">
            <h3 className="text-base font-bold mb-2 flex items-center space-x-2">
              <span>🚨</span> <span>{t.sosTitle}</span>
            </h3>
            <p className="text-xs text-slate-300 mb-4">{t.sosDesc}</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <a href="tel:102" className="bg-white/10 hover:bg-white/20 border border-white/10 p-3 rounded-xl flex items-center space-x-3 transition-all">
                <span className="text-xl">📞</span>
                <div>
                  <h4 className="text-xs font-bold">{t.sosMvd}</h4>
                  <p className="text-[10px] text-slate-400">{t.sosMvdSub}</p>
                </div>
              </a>
              <a href="https://t.me/Mvd_Cyber_Bot" target="_blank" className="bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/30 p-3 rounded-xl flex items-center space-x-3 transition-all">
                <span className="text-xl">✈️</span>
                <div>
                  <h4 className="text-xs font-bold">{t.sosTg}</h4>
                  <p className="text-[10px] text-blue-300">{t.sosTgSub}</p>
                </div>
              </a>
              <div className="bg-white/5 border border-white/5 p-3 rounded-xl flex items-center space-x-3">
                <span className="text-xl">💳</span>
                <div>
                  <h4 className="text-xs font-bold">{t.sosBank}</h4>
                  <p className="text-[10px] text-slate-400">{t.sosBankSub}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ПРАВАЯ КОЛОНКА (ИИ ЧАТ ЧЕРЕЗ ТЕМЫ) */}
        <div className={`border rounded-3xl p-5 shadow-xl flex flex-col justify-between min-h-[450px] lg:h-auto ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div>
            <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-ping"></div>
              <h3 className="text-sm font-bold flex items-center space-x-1.5">
                <span>🤖</span> <span>{t.chatTitle}</span>
              </h3>
            </div>

            <div className="space-y-3 max-h-[350px] lg:max-h-[500px] overflow-y-auto text-xs pr-1">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`p-3 rounded-2xl max-w-[85%] ${
                  msg.sender === 'bot' 
                    ? (isDarkMode ? 'bg-slate-950 text-slate-300 mr-auto' : 'bg-slate-100 text-slate-800 mr-auto') 
                    : 'bg-blue-600 text-white ml-auto'
                }`}>
                  {msg.text}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSendMessage} className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <input 
              type="text" 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder={t.chatPlaceholder} 
              className={`w-full border px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:border-blue-500 ${
                isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200'
              }`}
            />
            <button type="submit" className="bg-blue-600 text-white font-bold p-2.5 rounded-xl text-xs hover:bg-blue-700 transition-all">
              {t.chatSend}
            </button>
          </form>
        </div>

      </div>

      {/* МОДАЛКА АВТОРИЗАЦИИ С ЛОКАЛИЗАЦИЕЙ */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`p-6 rounded-3xl w-full max-w-md shadow-2xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white'}`}>
            
            <div className="flex border-b border-slate-100 dark:border-slate-800 mb-4">
              <button 
                type="button"
                onClick={() => setAuthMode('login')}
                className={`w-1/2 pb-3 text-sm font-bold border-b-2 transition-all ${authMode === 'login' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400'}`}
              >
                {t.modalTabLogin}
              </button>
              <button 
                type="button"
                onClick={() => setAuthMode('register')}
                className={`w-1/2 pb-3 text-sm font-bold border-b-2 transition-all ${authMode === 'register' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400'}`}
              >
                {t.modalTabReg}
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{t.labelLogin}</label>
                <input 
                  type="text" required value={username} onChange={(e) => setUsername(e.target.value)} placeholder="it_student" 
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 ${isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200'}`}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{t.labelPass}</label>
                <input 
                  type="password" placeholder="••••••••" 
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 ${isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200'}`}
                />
              </div>

              {authMode === 'register' && (
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{t.labelPassConfirm}</label>
                  <input 
                    type="password" placeholder="••••••••" 
                    className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 ${isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200'}`}
                  />
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button 
                  type="button" onClick={() => setShowLoginModal(false)}
                  className={`w-1/3 font-bold py-2.5 rounded-xl transition-all text-xs ${isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                >
                  {t.btnCancel}
                </button>
                <button type="submit" className="w-2/3 bg-blue-600 text-white font-bold py-2.5 rounded-xl hover:bg-blue-700 transition-all text-xs shadow-md">
                  {authMode === 'login' ? t.btnLogin : t.btnReg}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ФУТЕР */}
      <footer className={`border-t text-center text-xs py-4 transition-colors duration-300 ${isDarkMode ? 'border-slate-950 bg-slate-950 text-slate-500' : 'border-slate-200 bg-white text-slate-400'}`}>
        <p>{t.footer}</p>
      </footer>

    </div>
  );
}