import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
// Modules
import { UploadsModule } from './uploads/uploads.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { WorkspacesModule } from './workspaces/workspaces.module';
import { SubjectsModule } from './subjects/subjects.module';
import { DocumentsModule } from './documents/documents.module';
import { ReportsModule } from './reports/reports.module';
import { TagsModule } from './tags/tags.module';
import { ActivitiesModule } from './activities/activities.module';

@Module({
  imports: [
    // load env
    ConfigModule.forRoot({ isGlobal: true }),
    // static serving for uploaded files
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    // database setup
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const url = config.get<string>('DATABASE_URL');
        return {
          type: 'postgres',
          url,
          autoLoadEntities: true,
          synchronize: true, // dev only
        };
      },
    }),
    // feature modules
    AuthModule,
    UsersModule,
    WorkspacesModule,
    SubjectsModule,
    DocumentsModule,
    ReportsModule,
    TagsModule,
    ActivitiesModule,
    UploadsModule,
  ],
})
export class AppModule {}
