import 'dotenv/config';

import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from './token.service';

describe('TokenService', () => {
  let service: TokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TokenService],
    }).compile();

    service = module.get<TokenService>(TokenService);
  });

  it('서비스 정의 여부 확인', () => {
    expect(service).toBeDefined();
  });

  it('토큰 생성 여부 확인', () => {
    expect(service.createAccessToken(0, [])).toBeDefined();
  });

  it('올바른 토큰 인증', () => {
    const token = service.createAccessToken(0, []);
    expect(service.verifyAccessToken(token)).toHaveProperty('isValid', true);
  });

  it('잘못된 토큰 인증', () => {
    const token = service.createAccessToken(0, []);
    expect(service.verifyAccessToken(token + 'wrong')).toHaveProperty(
      'isValid',
      false,
    );
  });
});
