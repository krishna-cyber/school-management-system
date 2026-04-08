import { Connection } from 'mongoose';
import {
  Attendance,
  AttendanceSchema,
} from 'src/attendance/schema/attendance.schema';
import { Class, ClassSchema } from 'src/class/schemas/class.schema';
import { Exam, ExamSchema } from 'src/exam/schemas/exam.schema';
import { Marksheet, MarksheetSchema } from 'src/exam/schemas/marksheet.schema';
import { Fee, FeeSchema } from 'src/fee/schemas/fee.schema';
import { Student, StudentSchema } from 'src/student/schemas/student.schema';
import { Teacher, TeacherSchema } from 'src/teacher/schemas/teacher.schema';

export const ModelProvider = {
  studentModel: {
    provide: 'STUDENT_MODEL',
    useFactory: (tenantConnection: Connection) => {
      return tenantConnection.model(Student.name, StudentSchema);
    },
    inject: ['TENANT_CONNECTION'],
  },
  classModel: {
    provide: 'CLASS_MODEL',
    useFactory: (tenantConnection: Connection) => {
      return tenantConnection.model(Class.name, ClassSchema);
    },
    inject: ['TENANT_CONNECTION'],
  },
  examModel: {
    provide: 'EXAM_MODEL',
    useFactory: (tenantConnection: Connection) => {
      return tenantConnection.model(Exam.name, ExamSchema);
    },
    inject: ['TENANT_CONNECTION'],
  },
  feeModel: {
    provide: 'FEE_MODEL',
    useFactory: (tenantConnection: Connection) => {
      return tenantConnection.model(Fee.name, FeeSchema);
    },
    inject: ['TENANT_CONNECTION'],
  },
  teacherModel: {
    provide: 'TEACHER_MODEL',
    useFactory: (tenantConnection: Connection) => {
      return tenantConnection.model(Teacher.name, TeacherSchema);
    },
    inject: ['TENANT_CONNECTION'],
  },
  marksheetModel: {
    provide: 'MARKSHEET_MODEL',
    useFactory: (tenantConnection: Connection) => {
      return tenantConnection.model(Marksheet.name, MarksheetSchema);
    },
    inject: ['TENANT_CONNECTION'],
  },
  attendanceModel: {
    provide: 'ATTENDANCE_MODEL',
    useFactory: (tenantConnection: Connection) => {
      return tenantConnection.model(Attendance.name, AttendanceSchema);
    },
    inject: ['TENANT_CONNECTION'],
  },
};
