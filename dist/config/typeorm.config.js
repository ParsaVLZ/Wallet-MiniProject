"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmConfig = TypeOrmConfig;
function TypeOrmConfig() {
    return {
        type: "postgres",
        host: "localhost",
        port: 5432,
        username: "postgres",
        password: "791011",
        database: "wallet",
        autoLoadEntities: false,
        synchronize: true,
        entities: [
            "dist/**/**/**/*.entity{.ts,.js}",
            "dist/**/**/*.entity{.ts,.js}"
        ]
    };
}
//# sourceMappingURL=typeorm.config.js.map