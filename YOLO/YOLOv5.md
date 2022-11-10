### YOLOv5

**论文下载** ：YOLO v5目前暂无论文

**代码下载** ：[https://github.com/ultralytics/yoloV5](https://github.com/ultralytics/yoloV5)

2020年2月 `YOLO`之父Joseph Redmon宣布退出计算机视觉研究领域，2020 年 4 月 23 日 `YOLOv4`发布，2020 年 6 月 10 日 `YOLOv5`发布，但是两个版本的改进都属于多种技术堆积版本，且两个版本差异不大。

`YOLOv5`性能与 `YOLOv4`不相伯仲，同样也是现今最先进的对象检测技术，并在推理速度上是目前最强。

2020年2月YOLO之父Joseph Redmon宣布退出计算机视觉研究领域🚀。
2020 年 4 月 23 日YOLOv4发布☘️。
2020 年 6 月 10 日YOLOv5发布🔥。
⭐（1）该两个版本的改进都属于多种技术堆积版本，且两个版本差异不大。
🌟（2）一直在更新中，且更新较快（平均2~3个月一次）。
✨（3）yolov5对应的GitHub上有详细的项目说明。但由于v5项目的训练数据集过于庞大，故可以选择自己的数据集 or 小样本数据集学习。
[Roboflow：开源自动驾驶数据集。该数据集已经画好边界框；下载格式：YOLO v5 PyTorch。](https://public.roboflow.com/)

---

YOLOv4出现之后不久，YOLOv5横空出世。YOLOv5在YOLOv4算法的基础上做了进一步的改进，检测性能得到进一步的提升。虽然YOLOv5算法并没有与YOLOv4算法进行性能比较与分析，但是YOLOv5在COCO数据集上面的测试效果还是挺不错的。大家对YOLOv5算法的创新性半信半疑，有的人对其持肯定态度，有的人对其持否定态度。在我看来，YOLOv5检测算法中还是存在很多可以学习的地方，虽然这些改进思路看来比较简单或者创新点不足，但是它们确定可以提升检测算法的性能。其实工业界往往更喜欢使用这些方法，而不是利用一个超级复杂的算法来获得较高的检测精度。

![](https://img-blog.csdnimg.cn/20210212164452573.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L1daWjE4MTkxMTcxNjYx,size_16,color_FFFFFF,t_70#pic_center)

yolov5是在COCO数据集上预训练的系列模型，包含5个模型：YOLOv5n、 =YOLOv5s= 、YOLOv5m、YOLOv5l、YOLO5x。不同的变体模型使得YOLOv5能很好的在精度和速度中权衡，方便用户选择。

![在这里插入图片描述](https://img-blog.csdnimg.cn/ca87983109bc443d80bb28142c73fe42.png#pic_center)

#### 算法简介

YOLOv5是一种单阶段目标检测算法，该算法在YOLOv4的基础上添加了一些新的改进思路，使其速度与精度都得到了极大的性能提升。主要的改进思路如下所示：

- 输入端：在模型训练阶段，提出了一些改进思路，主要包括Mosaic数据增强、自适应锚框计算、自适应图片缩放；
- 基准网络：融合其它检测算法中的一些新思路，主要包括：Focus结构与CSP结构；
- Neck网络：目标检测网络在BackBone与最后的Head输出层之间往往会插入一些层，Yolov5中添加了FPN+PAN结构；
- Head输出层：输出层的锚框机制与YOLOv4相同，主要改进的是训练时的损失函数GIOU_Loss，以及预测框筛选的DIOU_nms。

#### 优缺特点

- 使用Pytorch框架，对用户非常友好，能够方便地训练自己的数据集，相对于YOLO v4采用的Darknet框架，Pytorch框架更容易投入生产。
- 代码易读，整合了大量的计算机视觉技术，非常有利于学习和借鉴。
- 不仅易于配置环境，模型训练也非常快速，并且批处理推理产生实时结果。
- 能够直接对单个图像，批处理图像，视频甚至网络摄像头端口输入进行有效推理。
- 能够轻松的将Pytorch权重文件转化为安卓使用的ONXX格式，然后可以转换为OpenCV的使用格式，或者通过CoreML转化为IOS格式，直接部署到手机应用端。
- 有非常轻量级的模型大小， YOLO v5 的大小仅有 27 M B 27MB27MB ， 使用 Darknet 架构的 YOLO v4 有 244 M B 244MB244MB
- 最后YOLO v5高达140 F P S 140FPS140FPS的对象识别速度令人印象非常深刻，使用体验非常棒。

#### 网络模型

![](https://img-blog.csdnimg.cn/20210211163722891.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L1daWjE4MTkxMTcxNjYx,size_16,color_FFFFFF,t_70#pic_center)

上图展示了YOLOv5目标检测算法的整体框图。对于一个目标检测算法而言，我们通常可以将其划分为4个通用的模块，具体包括：输入端、基准网络、Neck网络与Head输出端，对应于上图中的4个红色模块。YOLOv5算法具有4个版本，具体包括：YOLOv5s、YOLOv5m、YOLOv5l、YOLOv5x四种，本文重点讲解YOLOv5s，其它的版本都在该版本的基础上对网络进行加深与加宽。

- 输入端-输入端表示输入的图片。该网络的输入图像大小为608*608，该阶段通常包含一个图像预处理阶段，即将输入图像缩放到网络的输入大小，并进行归一化等操作。在网络训练阶段，YOLOv5使用Mosaic数据增强操作提升模型的训练速度和网络的精度；并提出了一种自适应锚框计算与自适应图片缩放方法。
- 基准网络-基准网络通常是一些性能优异的分类器种的网络，该模块用来提取一些通用的特征表示。YOLOv5中不仅使用了CSPDarknet53结构，而且使用了Focus结构作为基准网络。
- Neck网络-Neck网络通常位于基准网络和头网络的中间位置，利用它可以进一步提升特征的多样性及鲁棒性。虽然YOLOv5同样用到了SPP模块、FPN+PAN模块，但是实现的细节有些不同。
- Head输出端-Head用来完成目标检测结果的输出。针对不同的检测算法，输出端的分支个数不尽相同，通常包含一个分类分支和一个回归分支。YOLOv4利用GIOU_Loss来代替Smooth L1 Loss函数，从而进一步提升算法的检测精度。

###### YOLOv5基础组件

- CBL-CBL模块由Conv+BN+Leaky_relu激活函数组成，如上图中的模块1所示。
- Res unit-借鉴ResNet网络中的残差结构，用来构建深层网络，CBM是残差模块中的子模块，如上图中的模块2所示。
- CSP1_X-借鉴CSPNet网络结构，该模块由CBL模块、Res unint模块以及卷积层、Concate组成而成，如上图中的模块3所示。
- CSP2_X-借鉴CSPNet网络结构，该模块由卷积层和X个Res unint模块Concate组成而成，如上图中的模块4所示。
- Focus-如上图中的模块5所示，Focus结构首先将多个slice结果Concat起来，然后将其送入CBL模块中。
- SPP-采用1×1、5×5、9×9和13×13的最大池化方式，进行多尺度特征融合，如上图中的模块6所示。

###### Backbone（特征提取模块）

![在这里插入图片描述](https://img-blog.csdnimg.cn/963eb36d7bfd488798622a2f69564910.png#pic_center)

- （1）Backbone（骨干网络）：用于提取图像特征的网络。*常用不是我们自己设计的网络，而是通用网络模型resnet、VGG等。
  使用方式： 将通用模型作为backbone时，直接加载预训练模型的参数，再拼接上我们自己的网络。网络训练方法参考迁移学习的微调算法，即对预训练模型进行微调，使其更适合我们自己的任务。
- （2）Neck（脖子）：在backbone和head之间，是为了更好的利用backbone提取的特征。
- （3）Bottleneck（瓶颈）：指输出维度比输入维度小很多，就像由身体到脖子，变细了。经常设置的参数 bottle_num=256，指的是网络输出的数据的维度是256 ，可是输入进来的可能是1024维度的。
- （4）Head（头部）：head是获取网络输出内容的网络，利用之前提取的特征，head利用这些特征，做出预测。

Backbone结构主要分成三类：CNNs结构（非轻量级、轻量级）、Transformer结构、CNNs+Transformer结构。

![在这里插入图片描述](https://img-blog.csdnimg.cn/d2a5f81c0a1e4e6ba61d57f4119c46d7.png)

[深度学习框架-Backbone汇总（超详细讲解）](https://blog.csdn.net/qq_23981335/article/details/122538921?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522167126073716782388037959%2522%252C%2522scm%2522%253A%252220140713.130102334..%2522%257D&request_id=167126073716782388037959&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~top_positive~default-1-122538921-null-null.142%5Ev68%5Econtrol,201%5Ev4%5Eadd_ask,213%5Ev2%5Et3_esquery_v1&utm_term=backbone&spm=1018.2226.3001.4449)

一、普通（非轻量化）CNNs结构Backbone

- LeNet5：(1998)
- AlexNet：(2012)
- VGG：(2014)
- GoogLeNet（InceptionNet）系列：Inception-v1（GoogleNet）: (2015)、Inception-v2 （2015，BN-inception）、Inception-v3 (2015)、Inception-v4: (2017)、Inception-resnet-v2： (2017)
- Resnet: (2016)
- ResNet变种：ResNeXt （2016）、ResNeSt（2020）、Res2Net（2019）、DenseNet （2017）
- DPNet：(2017)
- NasNet：(2018)
- SENet及其变体SKNet：SENet（2017）、SKNet（2019）
- EfficientNet 系列：EfficientNet-V1(2019)、EfficientNet-V2(2021)
- Darknet系列：Darknet-19 （2016， YOLO v2 的 backbone）、Darknet-53 （2018， YOLOv3的 backbone）
- DLA (2018, Deep Layer Aggregation)

二、轻量化CNNs结构Backbone

- SqueezeNet：（2016）
- MobileNet-v1：（2017）
- XCeption：（2017, 极致的 Inception）
- MobileNet V2：（2018）
- ShuffleNet-v1：(2018)
- ShuffleNet-v2：(2018)
- MnasNet：（2019）
- MobileNet V3 （2019）
- CondenseNet（2017）
- ESPNet系列：ESPNet （2018）、ESPNetv2 （2018）
- ChannelNets
- PeleeNet
- IGC系列：IGCV1、IGCV2、IGCV3
- FBNet系列：FBNet、FBNetV2、FBNetV3
- GhostNet
- WeightNet
- MicroNet

三、 ViT（Vision Transformer ）结构Backbone

- ViT-H/14 和 ViT-L/16 （2020）（Vision Transformer，ViT）
- Swin Transformer（2021）
- PVT（2021, Pyramid Vision Transformer）
- MPViT （CVPR 2022，Multi-path Vision Transformer, 多路径 Vision Transformer）
- EdgeViTs （CVPR 2022，轻量级视觉Transformer）

四、CNNs+Transformer/Attention结构Backbone

- CoAtNet（#2 2021）
- BoTNet（#1 2021）

EfficientNet

[EfficientNet网络详解](https://blog.csdn.net/qq_37541097/article/details/114434046?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522167127208516782429769204%2522%252C%2522scm%2522%253A%252220140713.130102334..%2522%257D&request_id=167127208516782429769204&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~top_positive~default-1-114434046-null-null.142%5Ev68%5Econtrol,201%5Ev4%5Eadd_ask,213%5Ev2%5Et3_esquery_v1&utm_term=efficientnet&spm=1018.2226.3001.4449)

Mosaic数据增强-YOLOv5中在训练模型阶段仍然使用了Mosaic数据增强方法，该算法是在CutMix数据增强方法的基础上改进而来的。CutMix仅仅利用了两张图片进行拼接，而Mosaic数据增强方法则采用了4张图片，并且按照随机缩放、随机裁剪和随机排布的方式进行拼接而成，具体的效果如下图所示。这种增强方法可以将几张图片组合成一张，这样不仅可以丰富数据集的同时极大的提升网络的训练速度，而且可以降低模型的内存需求。

![](https://img-blog.csdnimg.cn/20210211164202660.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L1daWjE4MTkxMTcxNjYx,size_16,color_FFFFFF,t_70#pic_center)

- 自适应锚框计算-在YOLOv5系列算法中，针对不同的数据集，都需要设定特定长宽的锚点框。在网络训练阶段，模型在初始锚点框的基础上输出对应的预测框，计算其与GT框之间的差距，并执行反向更新操作，从而更新整个网络的参数，因此设定初始锚点框也是比较关键的一环。在YOLOv3和YOLOv4检测算法中，训练不同的数据集时，都是通过单独的程序运行来获得初始锚点框。YOLOv5中将此功能嵌入到代码中，每次训练时，根据数据集的名称自适应的计算出最佳的锚点框，用户可以根据自己的需求将功能关闭或者打开，具体的指令为parser.add_argument(’–noautoanchor’, action=‘store_ true’, help=‘disable autoanchor check’)，如果需要打开，只需要在训练代码时增加–noautoanch or选项即可。
- 自适应图片缩放-针对不同的目标检测算法而言，我们通常需要执行图片缩放操作，即将原始的输入图片缩放到一个固定的尺寸，再将其送入检测网络中。YOLO系列算法中常用的尺寸包括416*416，608 *608等尺寸。原始的缩放方法存在着一些问题，由于在实际的使用中的很多图片的长宽比不同，因此缩放填充之后，两端的黑边大小都不相同，然而如果填充的过多，则会存在大量的信息冗余，从而影响整个算法的推理速度。为了进一步提升YOLOv5算法的推理速度，该算法提出一种方法能够自适应的添加最少的黑边到缩放之后的图片中。

##### 基准网络细节详解

Focus结构-该结构的主要思想是通过slice操作来对输入图片进行裁剪。如下图所示，原始输入图片大小为608*608*3，经过Slice与Concat操作之后输出一个304*304*12的特征映射；接着经过一个通道个数为32的Conv层（该通道个数仅仅针对的是YOLOv5s结构，其它结构会有相应的变化），输出一个304*304*32大小的特征映射。

![](https://img-blog.csdnimg.cn/20210212091942352.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L1daWjE4MTkxMTcxNjYx,size_16,color_FFFFFF,t_70#pic_center)

CSP结构-YOLOv4网络结构中，借鉴了CSPNet的设计思路，仅仅在主干网络中设计了CSP结构。而YOLOv5中设计了两种CSP结构，以YOLOv5s网络为例，CSP1_X结构应用于Backbone主干网络中，另一种CSP2_X结构则应用于Neck网络中。CSP1_X与CSP2_X模块的实现细节如3.1所示。

##### Neck网络细节详解

FPN+PAN-YOLOv5的Neck网络仍然使用了FPN+PAN结构，但是在它的基础上做了一些改进操作，YOLOv4的Neck结构中，采用的都是普通的卷积操作。而YOLOv5的Neck网络中，采用借鉴CSPnet设计的CSP2结构，从而加强网络特征融合能力。下图展示了YOLOv4与YOLOv5的Neck网络的具体细节，通过比较我们可以发现：（1）灰色区域表示第1个不同点，YOLOv5不仅利用CSP2_\1结构代替部分CBL模块，而且去掉了下方的CBL模块；（2）绿色区域表示第2个不同点，YOLOv5不仅将Concat操作之后的CBL模块更换为CSP2_1模块，而且更换了另外一个CBL模块的位置；（3）蓝色区域表示第3个不同点，YOLOv5中将原始的CBL模块更换为CSP2_1模块。

![img](https://img-blog.csdnimg.cn/20210212162325316.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L1daWjE4MTkxMTcxNjYx,size_16,color_FFFFFF,t_70#pic_center)

#### 改进之处

[深入浅出Yolo系列之Yolov5核心基础知识完整讲解](https://blog.csdn.net/nan355655600/article/details/107852353?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522167210071416782428643883%2522%252C%2522scm%2522%253A%252220140713.130102334..%2522%257D&request_id=167210071416782428643883&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~top_positive~default-2-107852353-null-null.142%5Ev68%5Econtrol,201%5Ev4%5Eadd_ask,213%5Ev2%5Et3_esquery_v1&utm_term=yolov5&spm=1018.2226.3001.4187)

### YOLOX: Exceeding YOLO Series in 2021

论文下载：https://arxiv.org/abs/2107.08430

代码下载：https://github.com/Megvii-BaseDetection/YOLOX

##### 算法简介

YOLO X是旷视科技在目标检测方面的最新技术总结，同时也是CVPR2021自动驾驶竞赛冠军方案的技术总结。其将近两年来目标检测领域的各个角度的优秀进展与YOLO进行了巧妙地集成组合(比如解耦头、数据增广、标签分配、Anchor-free机制等)得到了YOLO X，性能取得了大幅地提升，同时仍保持了YOLO系列一贯地高效推理。

#### 网络改进

作者将YOLO检测器调整为了Anchor-Free形式并集成了其他先进检测技术(比如decoupled head、label assignment SimOTA)取得了SOTA性能，比如：

- 对于YOLO-Nano，所提方法仅需0.91M参数+1.08G FLOPs取得了25.3%AP指标，以1.8%超越了NanoDet；
- 对于YOLO v3，所提方法将指标提升到了47.3%，以3%超越了当前最佳；
- 具有与YOLOv4-CSP、YOLOv5-L相当的参数量，YOLOX-L取得了50.0%AP指标同事具有68.9fps推理速度(Tesla V100)，指标超过YOLOv5-L1.8%;
  YOLOX-L凭借单模型取得了Streaming Perception(Workshop on Autonomous Driving at CVPR 2021)竞赛冠军。
  值得一提的是，作者使用的baseline是 YOLO v3 + DarkNet53（所谓的YOLO v3-SSP）
- Decoupled Head 解耦头
  作者研究发现，检测头耦合会影响模型性能。采用解耦头替换YOLO的检测头可以显著改善模型收敛速度。因此，作者将YOLO的检测头替换为轻量解耦头：它包含一个1×1卷积进行通道降维，后接两个并行分支(均为3×3卷积)。注：轻量头可以带来1.1ms的推理耗时。
- Mosaic + Mixup 数据增强

  - Mosaic数据增强
  - Mixup数据增强： 对图像进行混类增强的算法，它将不同类之间的图像进行混合，从而扩充训练数据集
- Anchor-free

  - `YOLOv4`、`YOLOv5`均采用了 `YOLOv3`原始的anchor设置。然而anchor机制存在诸多问题：
    - (1) 为获得最优检测性能，需要在训练之前进行聚类分析以确定最佳anchor集合，这些anchor集合存在数据相关性，泛化性能较差；
    - (2) anchor机制提升了检测头的复杂度。
  - **Anchor-free**检测器在过去两年得到了长足发展并取得了与anchor检测器相当的性能。
  - 将YOLO转换为anchor-free形式非常简单，我们 **将每个位置的预测从3下降为1并直接预测四个值** ：即两个offset以及高宽。这种改进可以降低检测器的参数量于GFLOPs进而取得更快更优的性能： **42.9%AP** 。
- Multi positives

  - 为确保与YOLOv3的一致性，前述anchor-free版本仅仅对每个目标赋予一个正样本，而忽视了其他高质量预测。参考FCOS，我们简单的赋予中心3×3区域为正样本。此时 **模型性能提升到45.0%，超过了当前最佳U版YOLOv3的44.3%** 。
- SimOTA

  - OTA从全局角度分析了标签分配并将其转化为最优运输问题取得了SOTA性能。
  - 然而，作者发现：最优运输问题优化会带来25 % 25\%25%的额外训练耗时。因此，我们将其简化为动态t o p − k top-ktop−k策略以得到一个近似解(SimOTA)。SimOTA不仅可以降低训练时间，同时可以避免额外的超参问题。SimOTA的引入可以将模型的性能从45.0%提升到47.3%，大幅超越U版YOLOv的44.3%。
- End-to-End YOLO

  - `YOLO X`参考PSS添加了两个额外的卷积层，one-to-one标签分配以及stop gradient。这些改进使得目标检测器进化成了端到端形式，但会轻微降低性能与推理速度。
  - 因此，我们将该改进作为可选模块，并未包含在最终模型中。

### YOLOv6

#### 算法简介



[手把手教你运行YOLOv6（超详细）](https://blog.csdn.net/qq_58355216/article/details/125497521?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522167292182116800222884293%2522%252C%2522scm%2522%253A%252220140713.130102334..%2522%257D&request_id=167292182116800222884293&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~top_click~default-2-125497521-null-null.142%5Ev70%5Econtrol,201%5Ev4%5Eadd_ask&utm_term=yolov6&spm=1018.2226.3001.4187)

yolov6与v7相差不到十天，区别不大。

---

YOLOv6 是美团视觉智能部研发的一款目标检测框架，致力于工业应用。本框架同时专注于检测的精度和推理效率，在工业界常用的尺寸模型中：YOLOv6-nano 在 COCO 上精度可达 35.0% AP，在 T4 上推理速度可达 1242 FPS；YOLOv6-s 在 COCO 上精度可达 43.1% AP，在 T4 上推理速度可达 520 FPS。在部署方面，YOLOv6 支持 GPU（TensorRT）、CPU（OPENVINO）、ARM（MNN、TNN、NCNN）等不同平台的部署，极大地简化工程部署时的适配工作。

精度与速度远超 YOLOv5 和 YOLOX 的新框架

目标检测作为计算机视觉领域的一项基础性技术，在工业界得到了广泛的应用，其中 YOLO 系列算法因其较好的综合性能，逐渐成为大多数工业应用时的首选框架。至今，业界已衍生出许多 YOLO 检测框架，其中以 YOLOv5、YOLOX和 PP-YOLOE最具代表性，但在实际使用中，我们发现上述框架在速度和精度方面仍有很大的提升的空间。基于此，我们通过研究并借鉴了业界已有的先进技术，开发了一套新的目标检测框架——YOLOv6。该框架支持模型训练、推理及多平台部署等全链条的工业应用需求，并在网络结构、训练策略等算法层面进行了多项改进和优化，在 COCO 数据集上，YOLOv6 在精度和速度方面均超越其他同体量算法，相关结果如下图所示：

![](https://img-blog.csdnimg.cn/img_convert/d2a696f5189650046527c922fb4cbf0e.png)

#### 算法改进

YOLOv6 主要在 Backbone、Neck、Head 以及训练策略等方面进行了诸多的改进：

- 统一设计了更高效的 Backbone 和 Neck ：受到硬件感知神经网络设计思想的启发，基于 RepVGG style设计了可重参数化、更高效的骨干网络 EfficientRep Backbone 和 Rep-PAN Neck。
- 优化设计了更简洁有效的 Efficient Decoupled Head，在维持精度的同时，进一步降低了一般解耦头带来的额外延时开销。
- 在训练策略上，我们采用Anchor-free 无锚范式，同时辅以 SimOTA标签分配策略以及 SIoU边界框回归损失来进一步提高检测精度。

##### Hardware-friendly 的骨干网络设计

- YOLOv5/YOLOX 使用的 Backbone 和 Neck 都基于 CSPNet[5] 搭建，采用了多分支的方式和残差结构。对于 GPU 等硬件来说，这种结构会一定程度上增加延时，同时减小内存带宽利用率。下图为计算机体系结构领域中的 Roofline Model介绍图，显示了硬件中计算能力和内存带宽之间的关联关系。

![](https://img-blog.csdnimg.cn/img_convert/1751b8592685e9bca8c2cd30c919565b.png)

于是，我们基于硬件感知神经网络设计的思想，对 Backbone 和 Neck 进行了重新设计和优化。该思想基于硬件的特性、推理框架/编译框架的特点，以硬件和编译友好的结构作为设计原则，在网络构建时，综合考虑硬件计算能力、内存带宽、编译优化特性、网络表征能力等，进而获得又快又好的网络结构。对上述重新设计的两个检测部件，我们在 YOLOv6 中分别称为 EfficientRep Backbone 和 Rep-PAN Neck，其主要贡献点在于：

- 引入了 RepVGG[4] style 结构。
- 基于硬件感知思想重新设计了 Backbone 和 Neck。

RepVGG Style 结构是一种在训练时具有多分支拓扑，而在实际部署时可以等效融合为单个 3x3 卷积的一种可重参数化的结构（融合过程如下图所示）。通过融合成的 3x3 卷积结构，可以有效利用计算密集型硬件计算能力（比如 GPU），同时也可获得 GPU/CPU 上已经高度优化的 NVIDIA cuDNN 和 Intel MKL 编译框架的帮助。

实验表明，通过上述策略，YOLOv6 减少了在硬件上的延时，并显著提升了算法的精度，让检测网络更快更强。以 nano 尺寸模型为例，对比 YOLOv5-nano 采用的网络结构，本方法在速度上提升了21%，同时精度提升 3.6% AP。
![](https://img-blog.csdnimg.cn/img_convert/98e360a2911d9885dadba10937e15cb1.png)

EfficientRep Backbone：在 Backbone 设计方面，我们基于以上 Rep 算子设计了一个高效的Backbone。相比于 YOLOv5 采用的 CSP-Backbone，该 Backbone 能够高效利用硬件（如 GPU）算力的同时，还具有较强的表征能力。

下图为 EfficientRep Backbone 具体设计结构图，我们将 Backbone 中 stride=2 的普通 Conv 层替换成了 stride=2 的 RepConv层。同时，将原始的 CSP-Block 都重新设计为 RepBlock，其中 RepBlock 的第一个 RepConv 会做 channel 维度的变换和对齐。另外，我们还将原始的 SPPF 优化设计为更加高效的 SimSPPF。

![](https://img-blog.csdnimg.cn/img_convert/bba22fede35c745435dcb14a3645e1a6.png)

Rep-PAN：在 Neck 设计方面，为了让其在硬件上推理更加高效，以达到更好的精度与速度的平衡，我们基于硬件感知神经网络设计思想，为 YOLOv6 设计了一个更有效的特征融合网络结构。

Rep-PAN 基于 PAN拓扑方式，用 RepBlock 替换了 YOLOv5 中使用的 CSP-Block，同时对整体 Neck 中的算子进行了调整，目的是在硬件上达到高效推理的同时，保持较好的多尺度特征融合能力（Rep-PAN 结构图如下图所示）。

![](https://img-blog.csdnimg.cn/img_convert/aca569ccc49ff8cddb0e2b4e0182f0d0.jpeg)

##### 更简洁高效的 Decoupled Head

在 YOLOv6 中，我们采用了解耦检测头（Decoupled Head）结构，并对其进行了精简设计。原始 YOLOv5 的检测头是通过分类和回归分支融合共享的方式来实现的，而 YOLOX 的检测头则是将分类和回归分支进行解耦，同时新增了两个额外的 3x3 的卷积层，虽然提升了检测精度，但一定程度上增加了网络延时。

因此，我们对解耦头进行了精简设计，同时综合考虑到相关算子表征能力和硬件上计算开销这两者的平衡，采用 Hybrid Channels 策略重新设计了一个更高效的解耦头结构，在维持精度的同时降低了延时，缓解了解耦头中 3x3 卷积带来的额外延时开销。通过在 nano 尺寸模型上进行消融实验，对比相同通道数的解耦头结构，精度提升 0.2% AP 的同时，速度提升6.8%。

![](https://img-blog.csdnimg.cn/img_convert/69d1ce8f3b2a8438034d7721440f606c.jpeg)

##### 更有效的训练策略

为了进一步提升检测精度，我们吸收借鉴了学术界和业界其他检测框架的先进研究进展：Anchor-free 无锚范式 、SimOTA 标签分配策略以及 SIoU 边界框回归损失。

###### Anchor-free 无锚范式

YOLOv6 采用了更简洁的 Anchor-free 检测方法。由于 Anchor-based检测器需要在训练之前进行聚类分析以确定最佳 Anchor 集合，这会一定程度提高检测器的复杂度；同时，在一些边缘端的应用中，需要在硬件之间搬运大量检测结果的步骤，也会带来额外的延时。而 Anchor-free 无锚范式因其泛化能力强，解码逻辑更简单，在近几年中应用比较广泛。经过对 Anchor-free 的实验调研，我们发现，相较于Anchor-based 检测器的复杂度而带来的额外延时，Anchor-free 检测器在速度上有51%的提升。

###### SimOTA 标签分配策略


为了获得更多高质量的正样本，YOLOv6 引入了 SimOTA [4]算法动态分配正样本，进一步提高检测精度。YOLOv5 的标签分配策略是基于 Shape 匹配，并通过跨网格匹配策略增加正样本数量，从而使得网络快速收敛，但是该方法属于静态分配方法，并不会随着网络训练的过程而调整。

近年来，也出现不少基于动态标签分配的方法，此类方法会根据训练过程中的网络输出来分配正样本，从而可以产生更多高质量的正样本，继而又促进网络的正向优化。例如，OTA通过将样本匹配建模成最佳传输问题，求得全局信息下的最佳样本匹配策略以提升精度，但 OTA 由于使用了Sinkhorn-Knopp 算法导致训练时间加长，而 SimOTA[4]算法使用 Top-K 近似策略来得到样本最佳匹配，大大加快了训练速度。故 YOLOv6 采用了SimOTA 动态分配策略，并结合无锚范式，在 nano 尺寸模型上平均检测精度提升 1.3% AP。

###### **SIoU 边界框回归损失**

为了进一步提升回归精度，YOLOv6 采用了 SIoU边界框回归损失函数来监督网络的学习。目标检测网络的训练一般需要至少定义两个损失函数：分类损失和边界框回归损失，而损失函数的定义往往对检测精度以及训练速度产生较大的影响。

近年来，常用的边界框回归损失包括IoU、GIoU、CIoU、DIoU loss等等，这些损失函数通过考虑预测框与目标框之前的重叠程度、中心点距离、纵横比等因素来衡量两者之间的差距，从而指导网络最小化损失以提升回归精度，但是这些方法都没有考虑到预测框与目标框之间方向的匹配性。SIoU 损失函数通过引入了所需回归之间的向量角度，重新定义了距离损失，有效降低了回归的自由度，加快网络收敛，进一步提升了回归精度。通过在 YOLOv6s 上采用 SIoU loss 进行实验，对比 CIoU loss，平均检测精度提升 0.3% AP。


### YOLOv7

论文下载：[YOLOv7: Trainable bag-of-freebies sets new state-of-the-art for real-time objectdetectors](https://arxiv.org/pdf/2207.02696.pdf)
代码地址：[https://gitcode.net/mirrors/WongKinYiu/yolov7](https://gitcode.net/mirrors/WongKinYiu/yolov7?utm_source=csdn_github_accelerator)

在项目实战中，只研究yolov5或yolov7对应的项目即可，yolov3不要再研究了。因为现在的torch版本是高版本，而v3当时是低版本。


#### 性能表现

![在这里插入图片描述](https://img-blog.csdnimg.cn/1a6eefb9924c42b79dd6d1b567fe62b8.png#pic_center)

![在这里插入图片描述](https://img-blog.csdnimg.cn/b445c97ea0a647c7aa8af9deefaf99c6.png#pic_center)


#### 网络模型

![在这里插入图片描述](https://img-blog.csdnimg.cn/30664d8ce28247ab88a38d0468433b4c.png)

我们先整体来看下 YOLOV7，首先对输入的图片 resize 为 640x640 大小，输入到 backbone 网络中，然后经 head 层网络输出三层不同 size 大小的 **feature map**，经过 Rep 和 conv输出预测结果，这里以 coco 为例子，输出为 80 个类别，然后每个输出(x ,y, w, h, o) 即坐标位置和前后背景，3 是指的 anchor 数量，因此每一层的输出为 (80+5)x3 = 255再乘上 feature map 的大小就是最终的输出了。

![](https://img-blog.csdnimg.cn/2d84ae3155524a65bf42edf341b98692.png)


##### Backbone

OLOV7 的 backbone 如下图所示

![](https://img-blog.csdnimg.cn/img_convert/2ad2db0e7dffe36c4703dee13b50d238.webp?x-oss-process=image/format,png)

总共有 50 层, 我在上图用黑色数字把关键层数标示出来了。
首先是经过 4 层卷积层，如下图，CBS 主要是 Conv + BN + SiLU 构成，我在图中用不同的颜色表示不同的 size 和 stride, 如 (3, 2) 表示卷积核大小为 3 ，步长为 2。 在 config 中的配置如图。
![](https://img-blog.csdnimg.cn/img_convert/a54801444838f2c2d8a109a3447748f1.png)

![](https://img-blog.csdnimg.cn/img_convert/2ed9807bf0d1378f9d23dd2655bd50f5.png)

经过 4个 CBS 后，特征图变为 160 * 160 * 128 大小。随后会经过论文中提出的 ELAN 模块，ELAN 由多个 CBS 构成，其输入输出特征大小保持不变，通道数在开始的两个 CBS 会有变化， 后面的几个输入通道都是和输出通道保持一致的，经过最后一个 CBS 输出为需要的通道。


![](https://img-blog.csdnimg.cn/img_convert/0d47079456d307c9966eaf1e6059e42f.png)

![](https://img-blog.csdnimg.cn/img_convert/24b67a66f9667eb9ff6454fb00cd1036.webp?x-oss-process=image/format,png)

![](https://img-blog.csdnimg.cn/img_convert/3ee750bd2d3dc74ce9b118a1ef76a6a4.webp?x-oss-process=image/format,png)

**MP** 层 主要是分为 Maxpool 和 CBS , 其中 MP1 和 MP2 主要是通道数的比变化。

![](https://img-blog.csdnimg.cn/img_convert/9dc4bdb416a0ec0911886908e08b7d8a.png)

backbone的基本组件就介绍完了，我们整体来看下 backbone，经过 4 个 CBS 后，接入例如一个 ELAN ，然后后面就是三个 MP + ELAN 的输出，对应的就是 C3/C4/C5 的输出，大小分别为 80 * 80 * 512 ， 40 * 40 * 1024， 20 * 20 * 1024。 每一个 MP 由 5 层， ELAN 有 8 层， 所以整个 backbone 的层数为 4 + 8 + 13 * 3 = 51 层， 从 0 开始的话，最后一层就是第 50 层。

##### Head

![](https://img-blog.csdnimg.cn/img_convert/9ab24c8c986cfa8f6cfa5edca84f1aba.webp?x-oss-process=image/format,png)

![](https://img-blog.csdnimg.cn/img_convert/b28c245366ee8e7d1576a8c926b0989a.webp?x-oss-process=image/format,png)

![img](https://img-blog.csdnimg.cn/img_convert/30ce1df51948b277595377991ed807a8.webp?x-oss-process=image/format,png)

YOLOV7 head 其实就是一个 **pafpn** 的结构，和之前的YOLOV4，YOLOV5 一样。首先，对于 backbone 最后输出的 32 倍降采样特征图 C5，然后经过 SPPCSP，通道数从1024变为512。先按照 top down 和 C4、C3融合，得到 P3、P4 和 P5；再按 bottom-up 去和 P4、P5 做融合。这里基本和 YOLOV5 是一样的，区别在于将 YOLOV5 中的 CSP 模块换成了 ELAN-H 模块， 同时下采样变为了 MP2 层。

ELAN-H 模块是我自己命名的，它和 backbone 中的 ELAN 稍微有点区别就是 cat 的数量不同。

![](https://img-blog.csdnimg.cn/img_convert/da4756e59f5740258ff7783f0f44cbed.png)

对于 **pafpn** 输出的 P3、P4 和 P5 ， 经过 RepConv 调整通道数，最后使用 1x1 卷积去预测 objectness、class 和 bbox 三部分。

RepConv 在训练和推理是有一定的区别。训练时有三个分支的相加输出，部署时会将分支的参数重参数化到主分支上。
![](https://img-blog.csdnimg.cn/img_convert/3ca1b9f168c35e820d955a2b254c712d.png)

##### Loss Function

主要分带和不带辅助训练头两种，对应的训练脚本是train.py 和 train_aux.py。

- 不带辅助训练头（分损失函数和匹配策略两部分讨论）。
- 损失函数

    整体和YOLOV5 保持一致，分为坐标损失、目标置信度损失（GT就是训练阶段的普通iou）和分类损失三部分。其中目标置信度损失和分类损失采用BCEWithLogitsLoss（带log的二值交叉熵损失），坐标损失采用CIoU损失。详细参见utils/loss.py 里面的 ComputeLossOTA 函数 配合 配置文件里的各部分的权重设置。

- 匹配策略

   主要是参考了YOLOV5 和YOLOV6使用的当下比较火的simOTA.

- S1.训练前，会基于训练集中gt框，通过k-means聚类算法，先验获得9个从小到大排列的anchor框。(可选)

- S2.将每个gt与9个anchor匹配：Yolov5为分别计算它与9种anchor的宽与宽的比值（较大的宽除以较小的宽，比值大于1，下面的高同样操作）、高与高的比值，在宽比值、高比值这2个比值中，取最大的一个比值，若这个比值小于设定的比值阈值，这个anchor的预测框就被称为正样本。一个gt可能与几个anchor均能匹配上（此时最大9个）。所以一个gt可能在不同的网络层上做预测训练，大大增加了正样本的数量，当然也会出现gt与所有anchor都匹配不上的情况，这样gt就会被当成背景，不参与训练，说明anchor框尺寸设计的不好。

- S3.扩充正样本。根据gt框的中心位置，将最近的2个邻域网格也作为预测网格，也即一个groundtruth框可以由3个网格来预测；可以发现粗略估计正样本数相比前yolo系列，增加了三倍（此时最大27个匹配）。图下图浅黄色区域，其中实线是YOLO的真实网格，虚线是将一个网格四等分，如这个例子中，GT的中心在右下虚线网格，则扩充右和下真实网格也作为正样本。

- S4.获取与当前gt有top10最大iou的prediction结果。将这top10 （5-15之间均可，并不敏感）iou进行sum，就为当前gt的k。k最小取1。

- S5.根据损失函数计算每个GT和候选anchor损失（前期会加大分类损失权重，后面减低分类损失权重，如1:5->1:3），并保留损失最小的前K个。

- S6.去掉同一个anchor被分配到多个GT的情况。

![img](https://img-blog.csdnimg.cn/214ac9802feb4b6eadd6e5a7eaffae1a.png)

带辅助训练头（分损失函数和匹配策略两部分讨论）。

论文中，将负责最终输出的Head为lead Head，将用于辅助训练的Head称为auxiliary Head。本博客不重点讨论，原因是论文中后面的结构实验实现提升比较有限（0.3个点），具体可以看原文。

![img](https://img-blog.csdnimg.cn/d29afdabdf0742898f586ef2f9a5768f.png)

一些细节：其loss函数和不带辅助头相同，加权系数不能过大（aux head loss 和lead head loss 按照0.25:1的比例），否则会导致lead head出来的结果精度变低。匹配策略和上面的不带辅助头（只有lead head）只有很少不同，其中辅助头：

    *lead head中每个网格与gt如果匹配上，附加周边两个网格，而aux head附加4个网格（如上面导数第二幅图，匹配到浅黄+橘黄共5个网格）。

    *lead head中将top10个样本iou求和取整，而aux head中取top20。

    aux head更关注于recall，而lead head从aux head中精准筛选出样本。

    需要注意依照yolov5中的中心点回归方式，仅能将图中红色特征grid，预测在图中红色+蓝色区域（实线组成的网格代表着特征图grid，虚线代表着一个grid分成了4个象限），是根本无法将中心点预测到gt处(蓝色点)！而该红色特征grid在训练时是会作为正样本的。在aux head中，模型也并没有针对这种情况对回归方式作出更改。所以其实在aux head中，即使被分配为正样本的区域，经过不断的学习，可能仍然无法完全拟合至效果特别好。

![](https://img-blog.csdnimg.cn/8401b7ab61494671b688dee7c6a99e0c.png)


##### 算法改进

###### RepVGG（最大改进）

- 2014年：牛津大学著名研究组VGG (Visual Geometry Group)， 提出VGGNet。
- 2021年：清华大学、旷视科技以及香港科技大学等机构，基于VGG网络提出了RepVGG网络。

  ![在这里插入图片描述](https://img-blog.csdnimg.cn/67470d1a603f4e8daa652888df125dd6.png#pic_center)

由图可得：RepVGG无论是在精度还是速度上都已经超过了ResNet、EffcientNet以及ResNeXt等网络。

**结构重参数化**

RepVGG采用结构重参数化方法（structural re-parameterization technique）。
详细过程：

 （1）在训练时，使用ResNet-style的多分支模型（特点：增加模型的表征能力）；
 （2）在测试时，转化成VGG-style的单线路模型（特点：速度更快、更省内存并且更加的灵活。）。
过程特点：训练的网络结构和测试的网络结构可以不一样。


**核心操作** ：在测试时，将训练时的多分支模型进行合并得到一条单线路模型，即将1 x 1卷积 + BN（批标准化）与3 x 3卷积进行合并。详见下图。[RepVGG网络：结构重参数化 - 详细过程](https://blog.csdn.net/qq_37541097/article/details/125692507?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522167231547716782427436635%2522%252C%2522scm%2522%253A%252220140713.130102334..%2522%257D&request_id=167231547716782427436635&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~top_positive~default-1-125692507-null-null.142%5Ev68%5Econtrol,201%5Ev4%5Eadd_ask,213%5Ev2%5Et3_esquery_v1&utm_term=RepVGG&spm=1018.2226.3001.4449)

* [X] （1）将1x1卷积转换成3x3卷积=
* [X] （2）将BN和3x3卷积进行融合，转换成3x3卷积=
* [X] （3）多分支融合

**备注1** yolo的核心是检测速度快，而不是检测精度高。
**备注2** 在前六个版本的优化后，网络层只留下了3 x 3卷积、1 x 1卷积和BN（每一个网络层之后都进行批标准化）。
**备注3** VGG在2014年告诉我们，3 x 3卷积是计算速度最快的，优化最好的

![在这里插入图片描述](https://img-blog.csdnimg.cn/69570381805c45e9ba6c5fe83b6727a1.png#pic_center)

**备注4** ：黄色模块是激活函数ReLU，蓝色模块是卷积层。
**备注5** ：单支路模型可以节约内存。

**将1x1卷积转换成3x3卷积**

**具体过程** ：
（1）取1x1卷积（卷积核：1个参数），设置padding=1（即在其周围填补一圈全为零的元素）
（2）设置原始输入的padding=1
（3）输入与卷积核进行卷积操作，得到3x3的卷积层。
注意：原始输入和1x1卷积都需要设置padding


![在这里插入图片描述](https://img-blog.csdnimg.cn/91e9e82da1564ec2a769b248ea00bca6.png)

**将BN和3x3卷积进行融合，转换成3x3卷积**

![在这里插入图片描述](https://img-blog.csdnimg.cn/2298a38b9df14576a407fa3cfcea8d24.png#pic_center)

![在这里插入图片描述](https://img-blog.csdnimg.cn/8ab4bf6ef484496d88d9582438fc6743.png#pic_center)

**多分支融合**

**具体过程** ：=（1）将1x1卷积 + BN全部转换为3x3卷积，然后与3x3卷积进行合并，得到一个3x3卷积。=

![在这里插入图片描述](https://img-blog.csdnimg.cn/c9f7b6ebfdde49168f0e43bf51c00a8f.png#pic_center)


###### 正样本分配策略

主要目的：为了得到更多的正样本。=正样本即先验框（anchor），负样本即背景。=

具体计算过程分两个步骤：（1）提取anchor；（2）筛选anchor。

 **具体过程（提取anchor）** ：

* [X] =（1）计算先验框的中心点位置=
* [X] =（2）在当前网格中进行上、下、左、右四个方向的位置偏移，偏移大小为0.5。=
* [X] =（3）最后取当前网格 + 四个方向的中心点所对应的除当前网格的二个网格。共三个网格作为正样本=



![在这里插入图片描述](https://img-blog.csdnimg.cn/240b678b86274b0482fc16775a262dad.png#pic_center)

**具体过程（筛选anchor）** ：
提取满足要求的anchor，去掉匹配度低的anchor（该类anchor无意义）

条件一：候选框和先验框（anchor）的长款比范围：[0.25，4] 。
条件二： 候选框和先验框（anchor）的IOU要大于自定义阈值。
条件三： 候选框和先验框（anchor）的类别预测损失要大于自定义阈值。
条件四： 将以上三个条件进行权重相加，并进行损失排名。 loss = (权重系数1 * 条件一) + (权重系数2 * 条件二) + (权重系数3 * 条件三)
![在这里插入图片描述](https://img-blog.csdnimg.cn/155d5a4abec447dba4ae2a25a6bef36a.png#pic_center)

举例：以下是具体过程（筛选anchor）中，条件二的损失计算。

![在这里插入图片描述](https://img-blog.csdnimg.cn/1260b77440404389a45d0f0b1a28a361.png#pic_center)

![在这里插入图片描述](https://img-blog.csdnimg.cn/60a112781ef342eeb42334e778e1f632.png#pic_center)

* 备注1：计算=真实框（Ground Truth，GT）= 对应的候选框数量（损失计算得到的结果）：向下取整。
* 备注2：若一个候选框同时和多个anchor高度匹配，则按照损失计算原则，只能匹配损失最小对应的一个anchor。


###### 相对偏移量计算（yolov5/v7版）

![在这里插入图片描述](https://img-blog.csdnimg.cn/57bfe79ad70d4b93bef43aae0f031289.png#pic_center)

![在这里插入图片描述](https://img-blog.csdnimg.cn/864544650902404f826646a9883c8429.png#pic_center)


###### 辅助头（auxiliary head）+主头（lead head）

![在这里插入图片描述](https://img-blog.csdnimg.cn/b98558ddd96a4993a04f945169e61825.png#pic_center)

图5:辅助用粗，头部用细。与常规模型(a)相比，(b)模式具有辅助头。与通常的独立标签分配器©不同，我们提出(d)铅头引导标签分配器和(e)粗至细铅头引导标签分配器。该标签分配器通过前导头预测和地面真实值进行优化，同时得到训练前导头和辅助头的标签。详细的从粗到细的实现方法和约束设计细节将在附录中详细阐述。



### YOLOv8


#### 算法改进

具体改进如下：

- Backbone：使用的依旧是CSP的思想，不过YOLOv5中的C3模块被替换成了C2f模块，实现了进一步的轻量化，同时YOLOv8依旧使用了YOLOv5等架构中使用的SPPF模块
- PAN-FPN：YOLOv8依旧使用了PAN的思想，不过通过对比YOLOv5与YOLOv8的结构图可以看到，YOLOv8将YOLOv5中PAN-FPN上采样阶段中的CBS 1*1的卷积结构删除了，同时也将C3模块替换为了C2f模块；
- Decoupled-Head：YOLOv8使用了Decoupled-Head；
- Anchor-Free：YOLOv8抛弃了以往的Anchor-Base，使用了Anchor-Free的思想；
- 损失函数：YOLOv8使用VFL Loss作为分类损失，使用DFL Loss+CIOU Loss作为分类损失
- 样本匹配：YOLOv8抛弃了以往的IOU匹配或者单边比例的分配方式，而是使用了Task-Aligned Assigner匹配方式。

### 网络模型

![](https://img-blog.csdnimg.cn/34680db972ab48a1a93a24b34fb5653c.png)


##### 1.C3和C2F

C3模块，其主要是借助CSPNet提取分流的思想，同时结合残差结构的思想，设计了所谓的C3 Block，这里的CSP主分支梯度模块为BottleNeck模块，也就是所谓的残差模块。同时堆叠的个数由参数n来进行控制，也就是说不同规模的模型，n的值是有变化的。

其实这里的梯度流主分支，可以是任何之前你学习过的模块，比如，美团提出的YOLOv6中就是用来重参模块RepVGGBlock来替换BottleNeck Block来作为主要的梯度流分支，而百度提出的PP-YOLOE则是使用了RepResNet-Block来替换BottleNeck Block来作为主要的梯度流分支。而YOLOv7则是使用了ELAN Block来替换BottleNeck Block来作为主要的梯度流分支

![](https://img-blog.csdnimg.cn/aeab2cd185cf4fd9a93d7c28b1c64261.png)

```python
class C3(nn.Module):
    # CSP Bottleneck with 3 convolutions
    def __init__(self, c1, c2, n=1, shortcut=True, g=1, e=0.5):  # ch_in, ch_out, number, shortcut, groups, expansion
        super().__init__()
        c_ = int(c2 * e)  # hidden channels
        self.cv1 = Conv(c1, c_, 1, 1)
        self.cv2 = Conv(c1, c_, 1, 1)
        self.cv3 = Conv(2 * c_, c2, 1)  # optional act=FReLU(c2)
        self.m = nn.Sequential(*(Bottleneck(c_, c_, shortcut, g, e=1.0) for _ in range(n)))
 
    def forward(self, x):
        return self.cv3(torch.cat((self.m(self.cv1(x)), self.cv2(x)), 1))
```

通过C3模块的代码以及结构图可以看到，C3模块和名字思路一致，在模块中使用了3个卷积模块（Conv+BN+SiLU），以及n个BottleNeck。通过C3代码可以看出，对于cv1卷积和cv2卷积的通道数是一致的，而cv3的输入通道数是前者的2倍，因为cv3的输入是由主梯度流分支（BottleNeck分支）依旧次梯度流分支（CBS，cv2分支）cat得到的，因此是2倍的通道数，而输出则是一样的。


不妨我们再看一下YOLOv7中的模块：
![](https://img-blog.csdnimg.cn/cc4fe164bbf843de9da7a4aac1560c1d.png)

YOLOv7通过并行更多的梯度流分支，放ELAN模块可以获得更丰富的梯度信息，进而或者更高的精度和更合理的延迟。

C2f模块的结构图如下：

![](https://img-blog.csdnimg.cn/eb54246a038b420bbf281ba7374adaba.png)

我们可以很容易的看出，C2f模块就是参考了C3模块以及ELAN的思想进行的设计，让YOLOv8可以在保证轻量化的同时获得更加丰富的梯度流信息

```python
class C2f(nn.Module):
    # CSP Bottleneck with 2 convolutions
    def __init__(self, c1, c2, n=1, shortcut=False, g=1, e=0.5):  # ch_in, ch_out, number, shortcut, groups, expansion
        super().__init__()
        self.c = int(c2 * e)  # hidden channels
        self.cv1 = Conv(c1, 2 * self.c, 1, 1)
        self.cv2 = Conv((2 + n) * self.c, c2, 1)  # optional act=FReLU(c2)
        self.m = nn.ModuleList(Bottleneck(self.c, self.c, shortcut, g, k=((3, 3), (3, 3)), e=1.0) for _ in range(n))
 
    def forward(self, x):
        y = list(self.cv1(x).split((self.c, self.c), 1))
        y.extend(m(y[-1]) for m in self.m)
        return self.cv2(torch.cat(y, 1))
```



##### 2.PAN-FPN

YOLOv5的Neck部分的结构图如下：

![](https://img-blog.csdnimg.cn/948f32db4da048dd981fb1cbfcd32866.png)

YOLOV8的Neck部分的结构图如下:

![](https://img-blog.csdnimg.cn/6de7a7012a4b4d3b8509a82973b7be96.png)

可以看到，相对于YOLOv5，YOLOv8将C3模块以及RepBlock替换为了C2f，同时细心可以发现，相对于YOLOv5，YOLOv8选择将上采样之前的1×1卷积去除了，将Backbone不同阶段输出的特征直接送入了上采样操作。

##### 3.Head

YOLO v5的head的部分使用一个卷积同时做分类和回归（Coupled-Head）

![](https://img-blog.csdnimg.cn/b5da139964db40c69faffc6c0e5812d3.png)

而YOLOv8则是参考了YOLOX和YOLOV6，使用了Decoupled-Head，即使用两个卷积分别做分类和回归，同时由于使用了DFL 的思想，因此回归头的通道数也变成了4*reg_max的形式：

![](https://img-blog.csdnimg.cn/65c5827351e241d495782e4f31217c10.png)

从配置文件上看，YOLO v8相当于对代码做了优化，在下采样32倍时，通道数不加倍。与16倍的通道数相同，上采样做拼接时，不使用1*1的卷积调整通道数，此外，将通道数的调整放入下采样和c2f模块

yolo v5配置文件（右）和yolo v8配置文件（左）

![](https://img-blog.csdnimg.cn/e42a0e31670d4fd3af521ddf6979a595.png)![](https://img-blog.csdnimg.cn/96efc46c655048e09853c5393fcaac76.png)


##### 4.损失函数

对于YOLOv8，其分类损失为VFL Loss，其回归损失为CIOU Loss+DFL的形式，这里Reg_max默认为16。

VFL主要改进是提出了非对称的加权操作，FL和QFL都是对称的。而非对称加权的思想来源于论文PISA，该论文指出首先正负样本有不平衡问题，即使在正样本中也存在不等权问题，因为mAP的计算是主正样本。


![](https://img-blog.csdnimg.cn/54743420f0a8460ba95eb8c4d445b354.png)

q是label，正样本时候q为bbox和gt的IoU，负样本时候q=0，当为正样本时候其实没有采用FL，而是普通的BCE，只不过多了一个自适应IoU加权，用于突出主样本。而为负样本时候就是标准的FL了。可以明显发现VFL比QFL更加简单，主要特点是正负样本非对称加权、突出正样本为主样本。

针对这里的DFL（Distribution Focal Loss），其主要是将框的位置建模成一个 general distribution，让网络快速的聚焦于和目标位置距离近的位置的分布。

![](https://img-blog.csdnimg.cn/c26383667c984f0ba28f0df3e1a688e9.png)

DFL 能够让网络更快地聚焦于目标 y 附近的值，增大它们的概率；
DFL的含义是以交叉熵的形式去优化与标签y最接近的一左一右2个位置的概率，从而让网络更快的聚焦到目标位置的邻近区域的分布；也就是说学出来的分布理论上是在真实浮点坐标的附近，并且以线性插值的模式得到距离左右整数坐标的权重。

##### 5.样本的匹配

标签分配是目标检测非常重要的一环，在YOLOv5的早期版本中使用了MaxIOU作为标签分配方法。然而，在实践中发现直接使用边长比也可以达到一阿姨你的效果。而YOLOv8则是抛弃了Anchor-Base方法使用Anchor-Free方法，找到了一个替代边长比例的匹配方法，TaskAligned。
 

为与NMS搭配，训练样例的Anchor分配需要满足以下两个规则：
正常对齐的Anchor应当可以预测高分类得分，同时具有精确定位；不对齐的Anchor应当具有低分类得分，并在NMS阶段被抑制。基于上述两个目标TaskAligned设计了一个新的Anchor alignment metric 来在Anchor level 衡量Task-Alignment的水平。并且，Alignment metric 被集成在了 sample 分配和 loss function里来动态的优化每个 Anchor 的预测。

**Anchor alignment metric：**
        分类得分和 IoU表示了这两个任务的预测效果，所以，TaskAligned使用分类得分和IoU的高阶组合来衡量Task-Alignment的程度。使用下列的方式来对每个实例计算Anchor-level 的对齐程度：

![](https://img-blog.csdnimg.cn/4bbce5f41ee048e88a0518ff3630911c.png)

s 和 u 分别为分类得分和 IoU 值，α 和 β 为权重超参。从上边的公式可以看出来，t 可以同时控制分类得分和IoU 的优化来实现 Task-Alignment，可以引导网络动态的关注于高质量的Anchor。

Training sample Assignment：
        为提升两个任务的对齐性，TOOD聚焦于Task-Alignment Anchor，采用一种简单的分配规则选择训练样本：对每个实例，选择m个具有最大t值的Anchor作为正样本，选择其余的Anchor作为负样本。然后，通过损失函数(针对分类与定位的对齐而设计的损失函数)进行训练。



参考资源

- [YOLO系列总结：YOLOv1, YOLOv2, YOLOv3, YOLOv4, YOLOv5, YOLOX](https://blog.csdn.net/weixin_43662553/article/details/126392748)
- [YOLO系列详解：YOLOv1、YOLOv2、YOLOv3、YOLOv4、YOLOv5、YOLOv6、YOLOv7](https://blog.csdn.net/qq_40716944/article/details/114822515)
- [三万字硬核详解：yolov1、yolov2、yolov3、yolov4、yolov5、yolov7](https://blog.csdn.net/shinuone/article/details/127945805)
- [YOLO v8详解](https://blog.csdn.net/qq_52053775/article/details/128688001)
