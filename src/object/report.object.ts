import { ReportDto } from 'moyeo-object';
import { UserObject } from './user.object';
import { ReportEntity } from 'src/entity';

export class ReportObject implements ReportDto {
    id: number;
    user: UserObject;
    reporter: UserObject;
    createdAt: string;

    static from(report: ReportEntity): ReportObject {
        const reportObject = new ReportObject();

        reportObject.id = report.id;
        reportObject.user = UserObject.from(report.user);
        reportObject.reporter = UserObject.from(report.reporter);

        return reportObject;
    }
}
