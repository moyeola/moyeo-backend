# 파일 관려 관련 문서

Moyeo에 사용되는 정적 파일 (Image, Video 등)은 AWS S3를 통해 저장하고 관리됩니다.

## 파일명

파일명은 다음과 같은 규칙을 통해 정해집니다.

```
https://{버킷URL}/{카테고리}/{파일명(유닉스시간)}.{확장자}
(ex) https://moyeo.s3.ap-northeast-2.amazonaws.com/example/1691125199904.png
```

파일명의 경유 유저에 의해 생성되는 파일은 유닉스 시간을 사용하며, 운영진에 의해 사용되는 파일은 임의의 파일명을 사용할 수 있습니다.

### 카테고리

현재 Moyeo는 다음과 같은 카테고리를 사용합니다.

- `users`: 유저에 의해 생성되는 파일
  - `users/profiles` : 유저 프로필
- `resources` : 서비스 운영을 위한 파일
  - `resources/app`: 앱/웹 서비스에 사용되는 파일
  - `resources/other`: 기타 서비스를 위해 사용되는 파일
