import { getConnectionPool } from "@/app/libs/db";
import mssql from "mssql";
import { NextRequest, NextResponse } from "next/server";

interface PostData {
    username: string;
    database: string;
    port: number;
    password: string;
    host: string;
}

export async function POST(request: NextRequest) {
    const body: PostData = await request.json();
    console.log(body);
    
    const { database, host, password, port, username }: PostData = body;
    // Validate the request body
    if (!database || !host || !password || !port || !username) {
        return NextResponse.json(
            { error: 'the config are not proper' },
            { status: 400 }
        )
    }

    try {
        const config: mssql.config = { // Your database config (as before)
            user: username,
            password: password,
            server: host,
            port: port,
            database: database,
            pool: { // Pool configuration (important!)
                max: 10,
                min: 0,
                idleTimeoutMillis: 30000
            }, 
            options: {
                trustServerCertificate: true,
            }
        };

        const pool = await getConnectionPool(config); // Get the connection pool

        const request = new mssql.Request(pool);
        // ... (your query logic using the pool)

        const query = "SELECT * FROM [dbo].[tab_CarInfo]"; // Replace with your query
        const result = await request.query(query);
        return NextResponse.json(
            { error: null, result: result.recordset },
            { status: 200 }
        )

    } catch (error) {
        console.error("API Route Error:", error);
        return NextResponse.json(
            { error: error },
            { status: 500 }
        )
    }

}