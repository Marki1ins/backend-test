import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import helmet from "helmet";
import { LoggerErrorInterceptor } from "nestjs-pino";

import { AppModule } from "./app.module";
import { BadRequestException, ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: "*",
      methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
      preflightContinue: false,
      optionsSuccessStatus: 204,
    },
    logger: ["error", "warn", "debug", "log", "verbose"],
  });
  app.use(helmet());
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
      exceptionFactory: (errors) => {
        const formattedErrors = errors.map((err) => {
          if (err.constraints) {
            return Object.values(err.constraints).join(", ");
          }
          return "";
        });

        return new BadRequestException(formattedErrors.join(", "));
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle("API Example")
    .setDescription("API documentation")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  await app.listen(process.env.PORT ?? 3000).then(() => {
    console.log(`Server running on port ${process.env.PORT ?? 3000}`);
  });
}
void bootstrap();