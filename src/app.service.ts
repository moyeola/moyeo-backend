import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    getHello() {
        return {
            message: 'Hello, Moyeo Backend!',
            github: 'https://github.com/moyeola',
            developers: [
                {
                    name: '박현우',
                    github: 'https://github.com/HyunsDev',
                    role: ['Backend', 'Frontend'],
                },
                {
                    name: '편유나',
                    github: 'https://github.com/Drizzle03',
                    role: ['Design'],
                },
                {
                    name: '하선우',
                    github: 'https://github.com/Twince',
                    role: ['Frontend'],
                },
            ],
            contact: {
                email: 'hyuns@hyuns.dev',
            },
        };
    }
}
