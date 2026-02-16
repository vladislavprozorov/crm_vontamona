import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Users, Search, BarChart3, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-7xl font-bold mb-6 text-black">CRM</h1>
          <p className="text-2xl text-black/70 mb-12 max-w-2xl mx-auto font-light">
            Система управления клиентами
          </p>

          <Button asChild size="lg" className="text-lg px-12 py-7 bg-[#FC0] hover:bg-[#FFDB4D] text-black font-medium rounded-lg shadow-none border-none">
            <Link href="/clients">
              Перейти к клиентам
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow bg-[#F8F8F8]">
            <CardHeader>
              <Users className="h-12 w-12 text-black mb-4" />
              <CardTitle className="text-black text-xl font-semibold">Управление клиентами</CardTitle>
              <CardDescription className="text-black/60 text-base">
                Создавайте, редактируйте и удаляйте карточки клиентов
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow bg-[#F8F8F8]">
            <CardHeader>
              <Search className="h-12 w-12 text-black mb-4" />
              <CardTitle className="text-black text-xl font-semibold">Быстрый поиск</CardTitle>
              <CardDescription className="text-black/60 text-base">
                Находите нужных клиентов за секунды
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow bg-[#F8F8F8]">
            <CardHeader>
              <BarChart3 className="h-12 w-12 text-black mb-4" />
              <CardTitle className="text-black text-xl font-semibold">Аналитика</CardTitle>
              <CardDescription className="text-black/60 text-base">
                Отслеживайте историю взаимодействий
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}
