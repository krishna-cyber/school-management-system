import { Connection } from 'mongoose';
import { Student, StudentSchema } from 'src/student/schemas/student.schema';

export const tenantsModel = {
  studentModel: {
    provide: 'STUDENT_MODEL',
    useFactory: (tenantConnection: Connection) => {
      return tenantConnection.model(Student.name, StudentSchema);
    },
    inject: ['TENANT_CONNECTION'],
  },
};
