import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const config = new DocumentBuilder()
        .setTitle('TodoList API')
        .setDescription('API documentation for the TodoList project')
        .setVersion('1.0')
        .addTag('todos')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);

    await app.listen(3000);
    console.log(`Swagger running at http://localhost:3000/api-docs`);
}
bootstrap();