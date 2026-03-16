"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_module_1 = require("./app.module");
const cookieParser = require('cookie-parser');
async function bootstrap() {
    var _a;
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true }));
    app.use(cookieParser());
    app.enableCors({
        origin: ['https://www.your-frontend-domain.com', 'http://localhost:7373'],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
        allowedHeaders: 'Content-Type, Authorization',
    });
    const config = app.get(config_1.ConfigService);
    const port = (_a = config.get('PORT')) !== null && _a !== void 0 ? _a : 7373;
    await app.listen(port);
    console.log(`Server running on http://localhost:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map