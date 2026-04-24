# 人物图片审计

审计时间：2026-04-23

## 结论

- 当前交付版实际使用：`20` 张内置 SVG 卡通肖像
- 已在线验证可用：`0`
- 已确认失效：`0`
- 仍需人工联网确认的原始外链：`20`

当前线上交付策略：

- 为了确保图片一定能显示，`index.html` 已不再依赖这些外部头像地址
- 当前版本直接在页面内生成本地 SVG 卡通肖像，因此部署后不需要额外上传图片目录
- 下表保留的是原始外链来源，供你后续如果要换回真人照片时继续处理

原因：

- 当前执行环境对 `upload.wikimedia.org` 的外网请求持续超时
- 因此我无法在这个环境里诚实地把这些外链标成“已验证可用”
- 我没有盲目替换图片源，也没有假装已经逐张验活

页面内已经做的兜底：

- 当前默认使用内置 SVG 卡通肖像
- 如果你未来再切回外链或本地真人图，图片请求失败时仍会自动显示人物 Emoji fallback
- `img` 仍保留 `referrerpolicy="no-referrer"`

## 逐项记录

| 人物 | 当前图片来源 | 状态 | 备注 |
| --- | --- | --- | --- |
| Sam Altman | [Wikimedia Commons](https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Sam_Altman_CogX_2023_%28cropped%29.jpg/480px-Sam_Altman_CogX_2023_%28cropped%29.jpg) | 待人工联网确认 | 页面内有 fallback |
| Ilya Sutskever | [Wikimedia Commons](https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Ilya_Sutskever_-_ONS_2023_%28cropped%29.jpg/480px-Ilya_Sutskever_-_ONS_2023_%28cropped%29.jpg) | 待人工联网确认 | 页面内有 fallback |
| Yann LeCun | [Wikimedia Commons](https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Yann_LeCun_-_2019_%28cropped%29.jpg/480px-Yann_LeCun_-_2019_%28cropped%29.jpg) | 待人工联网确认 | 页面内有 fallback |
| Elon Musk | [Wikimedia Commons](https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Elon_Musk_Colorado_2022_%28cropped2%29.jpg/480px-Elon_Musk_Colorado_2022_%28cropped2%29.jpg) | 待人工联网确认 | 页面内有 fallback |
| 李飞飞（Fei-Fei Li） | [Wikimedia Commons](https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Feifei_li.jpg/480px-Feifei_li.jpg) | 待人工联网确认 | 页面内有 fallback |
| Demis Hassabis | [Wikimedia Commons](https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Demis_Hassabis_Royal_Society.jpg/480px-Demis_Hassabis_Royal_Society.jpg) | 待人工联网确认 | 页面内有 fallback |
| Dario Amodei | [Wikimedia Commons](https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Dario_Amodei_2024_%28cropped%29.jpg/480px-Dario_Amodei_2024_%28cropped%29.jpg) | 待人工联网确认 | 页面内有 fallback |
| Jensen Huang（黄仁勋） | [Wikimedia Commons](https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Jensen_Huang_-_2024_%28cropped%29.jpg/480px-Jensen_Huang_-_2024_%28cropped%29.jpg) | 待人工联网确认 | 页面内有 fallback |
| Andrej Karpathy | [Wikimedia Commons](https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Andrej_Karpathy_-_2023_%28cropped%29.jpg/480px-Andrej_Karpathy_-_2023_%28cropped%29.jpg) | 待人工联网确认 | 页面内有 fallback |
| Geoffrey Hinton | [Wikimedia Commons](https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Geoffrey_Hinton_%28cropped%29.jpg/480px-Geoffrey_Hinton_%28cropped%29.jpg) | 待人工联网确认 | 页面内有 fallback |
| Yoshua Bengio | [Wikimedia Commons](https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Yoshua_Bengio_-_2023_%28cropped%29.jpg/480px-Yoshua_Bengio_-_2023_%28cropped%29.jpg) | 待人工联网确认 | 页面内有 fallback |
| Sundar Pichai | [Wikimedia Commons](https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Sundar_Pichai_2022_%28cropped%29.jpg/480px-Sundar_Pichai_2022_%28cropped%29.jpg) | 待人工联网确认 | 页面内有 fallback |
| Mark Zuckerberg | [Wikimedia Commons](https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Mark_Zuckerberg_F8_2019_Keynote_%2832830578717%29_%28cropped%29.jpg/480px-Mark_Zuckerberg_F8_2019_Keynote_%2832830578717%29_%28cropped%29.jpg) | 待人工联网确认 | 页面内有 fallback |
| Jeff Dean | [Wikimedia Commons](https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Jeff_Dean_%28computer_scientist%29.jpg/480px-Jeff_Dean_%28computer_scientist%29.jpg) | 待人工联网确认 | 页面内有 fallback |
| Mustafa Suleyman | [Wikimedia Commons](https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Mustafa_Suleyman_-_2023_%28cropped%29.jpg/480px-Mustafa_Suleyman_-_2023_%28cropped%29.jpg) | 待人工联网确认 | 页面内有 fallback |
| Greg Brockman | [Wikimedia Commons](https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Greg_Brockman_TechCrunch_2024_%28cropped%29.jpg/480px-Greg_Brockman_TechCrunch_2024_%28cropped%29.jpg) | 待人工联网确认 | 页面内有 fallback |
| Emad Mostaque | [Wikimedia Commons](https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Emad_Mostaque_-_2023_%28cropped%29.jpg/480px-Emad_Mostaque_-_2023_%28cropped%29.jpg) | 待人工联网确认 | 页面内有 fallback |
| 吴恩达（Andrew Ng） | [Wikimedia Commons](https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Andrew_Ng_at_AI_For_Good_2017.jpg/480px-Andrew_Ng_at_AI_For_Good_2017.jpg) | 待人工联网确认 | 页面内有 fallback |
| Reid Hoffman | [Wikimedia Commons](https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Reid_Hoffman_%28cropped%29.jpg/480px-Reid_Hoffman_%28cropped%29.jpg) | 待人工联网确认 | 页面内有 fallback |
| Alan Turing | [Wikimedia Commons](https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Alan_Turing_Aged_16.jpg/480px-Alan_Turing_Aged_16.jpg) | 待人工联网确认 | 页面内有 fallback |

## 后续建议

如果你后续能在正常联网环境里继续推进，最稳妥的第二阶段方案是：

1. 逐张下载确认可用的人物头像
2. 放进本地 `images/` 目录
3. 把 `index.html` 里的 `photo` 改为相对路径
4. 再保留现在的 Emoji fallback 作为最终兜底
