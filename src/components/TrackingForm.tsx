import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Search, Package, Truck, CheckCircle, Clock, AlertCircle, RefreshCw, History, X } from "lucide-react";
import { Badge } from "./ui/badge";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { trackCargo, refreshTracking, addToHistory, clearError, clearTracking, clearHistory } from "../store/slices/trackingSlice";
import { Alert, AlertDescription } from "./ui/alert";

export function TrackingForm() {
  const dispatch = useAppDispatch();
  const { currentTracking, isLoading, error, searchHistory } = useAppSelector((state) => state.tracking);
  
  const [trackingCode, setTrackingCode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingCode.trim()) return;

    dispatch(clearError());
    
    const result = await dispatch(trackCargo(trackingCode));
    
    if (trackCargo.fulfilled.match(result)) {
      dispatch(addToHistory(trackingCode.toUpperCase()));
    }
  };

  const handleRefresh = () => {
    if (currentTracking) {
      dispatch(refreshTracking(currentTracking.trackingCode));
    }
  };

  const handleHistoryClick = (code: string) => {
    setTrackingCode(code);
    dispatch(trackCargo(code));
  };

  const handleClearTracking = () => {
    dispatch(clearTracking());
    setTrackingCode('');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'in-transit':
        return <Truck className="w-4 h-4 text-blue-500" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'delayed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Package className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600">Ожидает отправки</Badge>;
      case 'in-transit':
        return <Badge variant="outline" className="text-blue-600">В пути</Badge>;
      case 'delivered':
        return <Badge variant="outline" className="text-green-600">Доставлено</Badge>;
      case 'delayed':
        return <Badge variant="outline" className="text-red-600">Задержано</Badge>;
      default:
        return <Badge variant="outline">Неизвестно</Badge>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 ">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Отслеживание груза
          </CardTitle>
          <CardDescription>
            Введите трек-код для получения актуальной информации о доставке
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Введите трек-код (например: TK001234567)"
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value)}
                className="h-12 border-1 outline-none"
                disabled={isLoading}
              />
            </div>
            <Button type="submit" disabled={isLoading || !trackingCode.trim()} className="h-12 px-8">
              {isLoading ? (
                <>
                  <div className="w-4 h-4  rounded-full animate-spin mr-2" />
                  Поиск...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Отследить
                </>
              )}
            </Button>
          </form>
          
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Search History */}
          {searchHistory.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <History className="w-4 h-4" />
                  История поиска
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => dispatch(clearHistory())}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((code, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    onClick={() => handleHistoryClick(code)}
                  >
                    {code}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {currentTracking && (
        <div className="space-y-6">
          {/* Основная информация */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  Информация о грузе
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={isLoading}
                    className="ml-2"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  </Button>
                </CardTitle>
                <div className="flex items-center gap-2">
                  {getStatusBadge(currentTracking.status)}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearTracking}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Трек-код</p>
                    <p className="font-mono">{currentTracking.trackingCode}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Товар</p>
                    <p>{currentTracking.product}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Отправитель</p>
                    <p>{currentTracking.sender}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Получатель</p>
                    <p>{currentTracking.receiver}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Текущее местоположение</p>
                    <p className="flex items-center gap-2">
                      {getStatusIcon(currentTracking.status)}
                      {currentTracking.currentLocation}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Ожидаемая дата доставки</p>
                    <p>{currentTracking.estimatedDelivery}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Последнее обновление</p>
                    <p>{currentTracking.lastUpdate}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* История перемещений */}
          <Card>
            <CardHeader>
              <CardTitle>История перемещений</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentTracking.timeline.map((event, index) => (
                  <div key={index} className="flex gap-4 pb-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      {getStatusIcon(event.status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium">{event.status}</h4>
                        <span className="text-sm text-muted-foreground">{event.timestamp}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{event.location}</p>
                      <p className="text-sm">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Примеры трек-кодов для тестирования */}
      <Card>
        <CardHeader>
          <CardTitle>Для тестирования</CardTitle>
          <CardDescription>Используйте эти трек-коды для проверки работы системы</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge 
              variant="outline" 
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
              onClick={() => setTrackingCode('TK001234567')}
            >
              TK001234567 (В пути)
            </Badge>
            <Badge 
              variant="outline" 
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
              onClick={() => setTrackingCode('TK987654321')}
            >
              TK987654321 (Доставлено)
            </Badge>
            <Badge 
              variant="outline" 
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
              onClick={() => setTrackingCode('TK555666777')}
            >
              TK555666777 (Задержано)
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}