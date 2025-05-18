
import { attendanceData } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AttendanceCalendar = () => {
  return (
    <Card className="w-full">
      <CardHeader className="bg-corsica-sand/50">
        <CardTitle className="text-xl">Calendrier de présence 📅</CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium">Prénom</th>
                <th className="text-left p-4 font-medium">Du</th>
                <th className="text-left p-4 font-medium">Au</th>
                <th className="text-left p-4 font-medium">Transport</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((person, index) => (
                <tr key={person.name} className={index % 2 === 0 ? 'bg-white' : 'bg-muted/20'}>
                  <td className="p-4 font-medium">{person.name}</td>
                  <td className="p-4">{person.startDate}</td>
                  <td className="p-4">{person.endDate}</td>
                  <td className="p-4">
                    <span>{person.transport}</span>
                    <span className="ml-2">{person.transportIcon}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceCalendar;
