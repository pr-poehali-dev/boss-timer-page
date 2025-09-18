import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import Icon from '@/components/ui/icon';

interface Boss {
  id: number;
  name: string;
  type: 'raid' | 'world' | 'dungeon';
  location: string;
  level: number;
  respawnTime: number;
  lastKilled?: Date;
  isCompleted: boolean;
  notificationsEnabled: boolean;
  image: string;
  description?: string;
  rewards?: string[];
}

const BossTracker: React.FC = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isLocalTime, setIsLocalTime] = useState(true);
  const [language, setLanguage] = useState('en');
  const [showCompleted, setShowCompleted] = useState(true);
  const [levelFilter, setLevelFilter] = useState('all');
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const [bosses, setBosses] = useState<Boss[]>([
    {
      id: 1,
      name: 'Ancient Dragon Lord',
      type: 'raid',
      location: 'Dragon\'s Peak',
      level: 150,
      respawnTime: 3600000, // 1 hour in ms
      lastKilled: new Date(Date.now() - 2400000), // 40 minutes ago
      isCompleted: false,
      notificationsEnabled: true,
      image: '/img/093154dc-49cf-45ab-9979-ba75f069dcbd.jpg',
      description: 'A legendary dragon with massive health pool and devastating fire attacks.',
      rewards: ['Legendary Sword', 'Dragon Scale Armor', '50,000 Gold']
    },
    {
      id: 2,
      name: 'Shadow Knight Commander',
      type: 'world',
      location: 'Forsaken Castle',
      level: 143,
      respawnTime: 7200000, // 2 hours in ms
      lastKilled: new Date(Date.now() - 5400000), // 1.5 hours ago
      isCompleted: false,
      notificationsEnabled: false,
      image: '/img/fea338f8-82a2-4b4c-bed6-732351b058fd.jpg',
      description: 'Elite knight with powerful dark magic and summoning abilities.',
      rewards: ['Shadow Blade', 'Dark Magic Tome', '30,000 Gold']
    },
    {
      id: 3,
      name: 'Lich of the Void',
      type: 'dungeon',
      location: 'Necropolis Depths',
      level: 141,
      respawnTime: 1800000, // 30 minutes in ms
      lastKilled: new Date(Date.now() - 600000), // 10 minutes ago
      isCompleted: true,
      notificationsEnabled: true,
      image: '/img/eb51d873-651e-4425-bbfd-79c6800fec0b.jpg',
      description: 'Undead sorcerer with life-draining spells and skeletal minions.',
      rewards: ['Staff of the Void', 'Necromancer Robes', '25,000 Gold']
    }
  ]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isDarkTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkTheme]);

  const getTimeUntilRespawn = (boss: Boss) => {
    if (!boss.lastKilled) return 'Available';
    
    const timeSinceKilled = currentTime.getTime() - boss.lastKilled.getTime();
    const timeUntilRespawn = boss.respawnTime - timeSinceKilled;
    
    if (timeUntilRespawn <= 0) return 'Available';
    
    const hours = Math.floor(timeUntilRespawn / 3600000);
    const minutes = Math.floor((timeUntilRespawn % 3600000) / 60000);
    const seconds = Math.floor((timeUntilRespawn % 60000) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'raid': return 'Users';
      case 'world': return 'Globe';
      case 'dungeon': return 'Skull';
      default: return 'CircleAlert';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'raid': return 'bg-red-500';
      case 'world': return 'bg-blue-500';
      case 'dungeon': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const toggleCompletion = (id: number) => {
    setBosses(bosses.map(boss => 
      boss.id === id ? { ...boss, isCompleted: !boss.isCompleted } : boss
    ));
  };

  const toggleNotifications = (id: number) => {
    setBosses(bosses.map(boss => 
      boss.id === id ? { ...boss, notificationsEnabled: !boss.notificationsEnabled } : boss
    ));
  };

  const filteredBosses = bosses.filter(boss => {
    if (!showCompleted && boss.isCompleted) return false;
    if (levelFilter !== 'all' && boss.level.toString() !== levelFilter) return false;
    return true;
  });

  const translations = {
    en: {
      title: 'Boss Tracker',
      home: 'Home',
      trackers: 'Trackers', 
      settings: 'Settings',
      about: 'About',
      localTime: 'Local Time',
      serverTime: 'Server Time',
      showAll: 'Show All',
      hideCompleted: 'Hide Completed',
      allLevels: 'All Levels',
      boss: 'Boss',
      type: 'Type',
      location: 'Location',
      timeLeft: 'Time Left',
      completed: 'Completed',
      notifications: 'Notifications',
      available: 'Available',
      description: 'Description',
      rewards: 'Rewards'
    },
    ru: {
      title: 'Трекер Боссов',
      home: 'Главная',
      trackers: 'Трекеры',
      settings: 'Настройки', 
      about: 'О нас',
      localTime: 'Местное время',
      serverTime: 'Серверное время',
      showAll: 'Показать все',
      hideCompleted: 'Скрыть выполненные',
      allLevels: 'Все уровни',
      boss: 'Босс',
      type: 'Тип',
      location: 'Локация',
      timeLeft: 'До появления',
      completed: 'Выполнено',
      notifications: 'Уведомления',
      available: 'Доступен',
      description: 'Описание',
      rewards: 'Награды'
    }
  };

  const t = translations[language as keyof typeof translations];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold text-primary">{t.title}</h1>
              <nav className="hidden md:flex space-x-6">
                <Button variant="ghost" className="text-foreground hover:text-primary">
                  {t.home}
                </Button>
                <Button variant="ghost" className="text-foreground hover:text-primary">
                  {t.trackers}
                </Button>
                <Button variant="ghost" className="text-foreground hover:text-primary">
                  {t.settings}
                </Button>
                <Button variant="ghost" className="text-foreground hover:text-primary">
                  {t.about}
                </Button>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Time Toggle */}
              <div className="flex items-center space-x-2">
                <Icon name="Clock" size={16} />
                <span className="text-sm">{isLocalTime ? t.localTime : t.serverTime}</span>
                <Switch checked={isLocalTime} onCheckedChange={setIsLocalTime} />
              </div>

              {/* Language Selector */}
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-32">
                  <div className="flex items-center space-x-2">
                    <Icon name="Globe" size={16} />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ru">Русский</SelectItem>
                </SelectContent>
              </Select>

              {/* Theme Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDarkTheme(!isDarkTheme)}
                className="flex items-center space-x-2"
              >
                <Icon name={isDarkTheme ? "Sun" : "Moon"} size={16} />
                <span className="hidden sm:inline">
                  {isDarkTheme ? 'Light' : 'Dark'}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Icon name="Filter" size={20} />
              <span>Filters</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  checked={showCompleted} 
                  onCheckedChange={setShowCompleted}
                />
                <span>{showCompleted ? t.showAll : t.hideCompleted}</span>
              </div>
              
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder={t.allLevels} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.allLevels}</SelectItem>
                  <SelectItem value="120">Level 120</SelectItem>
                  <SelectItem value="141">Level 141</SelectItem>
                  <SelectItem value="143">Level 143</SelectItem>
                  <SelectItem value="150">Level 150</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Boss Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16"></TableHead>
                  <TableHead>{t.boss}</TableHead>
                  <TableHead>{t.type}</TableHead>
                  <TableHead>{t.location}</TableHead>
                  <TableHead>{t.timeLeft}</TableHead>
                  <TableHead className="text-center">{t.completed}</TableHead>
                  <TableHead className="text-center">{t.notifications}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBosses.map((boss) => (
                  <Collapsible key={boss.id} open={expandedRow === boss.id} onOpenChange={(open) => setExpandedRow(open ? boss.id : null)}>
                    <CollapsibleTrigger asChild>
                      <TableRow className="cursor-pointer hover:bg-muted/50 transition-colors">
                        <TableCell>
                          <img 
                            src={boss.image} 
                            alt={boss.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{boss.name}</div>
                            <div className="text-sm text-muted-foreground">Level {boss.level}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={`${getTypeColor(boss.type)} text-white`}>
                            <Icon name={getTypeIcon(boss.type)} size={14} className="mr-1" />
                            {boss.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{boss.location}</TableCell>
                        <TableCell>
                          <span className={`font-mono ${getTimeUntilRespawn(boss) === 'Available' ? 'text-green-500' : 'text-red-500'}`}>
                            {getTimeUntilRespawn(boss)}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleCompletion(boss.id);
                            }}
                          >
                            <Icon 
                              name={boss.isCompleted ? "CheckCircle" : "Circle"} 
                              size={20}
                              className={boss.isCompleted ? "text-green-500" : "text-muted-foreground"}
                            />
                          </Button>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleNotifications(boss.id);
                            }}
                          >
                            <Icon 
                              name={boss.notificationsEnabled ? "Bell" : "BellOff"} 
                              size={20}
                              className={boss.notificationsEnabled ? "text-blue-500" : "text-muted-foreground"}
                            />
                          </Button>
                        </TableCell>
                      </TableRow>
                    </CollapsibleTrigger>
                    <CollapsibleContent asChild>
                      <TableRow>
                        <TableCell colSpan={7} className="bg-muted/30">
                          <div className="p-4 space-y-4">
                            <div>
                              <h4 className="font-medium mb-2">{t.description}</h4>
                              <p className="text-muted-foreground">{boss.description}</p>
                            </div>
                            {boss.rewards && (
                              <div>
                                <h4 className="font-medium mb-2">{t.rewards}</h4>
                                <div className="flex flex-wrap gap-2">
                                  {boss.rewards.map((reward, index) => (
                                    <Badge key={index} variant="outline">{reward}</Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default BossTracker;