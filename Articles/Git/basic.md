# git 基本工作流程

1.  创建或者修改文件
2.  使用 `git add .` 把修改或创建文件提交到本地暂存区中
3.  使用 `git commit -m "xxx"` 把代码提交到本地代码库
4.  （以上并没有更新远程仓库） 使用`git push origin xxxx `更新远程代码库

### **1.获取和创建项目命令**

`git init` 在当前目录下创建一个仓库
`git clone git@github.com:xxxx` 拷贝一个仓库到本地

### **2.其他基本命令**

`git add filename` 添加一个文件到暂存区中
`git status` 查看当前项目状态

-   查看忽略的文件状态: `git status --ignored`
-   查看详细的状态信息: `git status -v`

`git diff` 查看尚未缓存的状态

1.  查看已缓存的改动： `git diff --cached`
2.  查看已缓存的与未缓存的所有改动：`git diff HEAD`
3.  显示摘要而非整个 diff：`git diff --stat`

### **3.关于分支管理常用命令**

`git checkout  name` 切换分支
`git checkout -b name` 添加新分支并切换分支
`git branch` 查看本地分支
`git branch -D  name` 删除本地分支
`git branch -a` 查看远程仓库分支
`git reset [--soft | --mixed | --hard] [HEAD]` 回退版本某一次记录

```javascript
git reset HEAD^ // 回退上一个版本
git reset HEAD^ hello.php //回退 hello.php 文件的版本到上一个版本
git reset  052e    //回退到指定版本
git reset --soft HEAD // 用于回退某一个版本
git reset --soft HEAD~3 // 回退到上上上一个版本
git reset –hard bae128  //回退到某个版本回退点之前的所有信息。
git reset --hard origin/master //将本地的状态回退到和远程的一样
```

撤回 commit 版本 1.`git log` 查看 commit 记录 2. `git reset --hard  o67123` 回退版本
回退之后再修改文件提交代码会有一下这种问题
![在这里插入图片描述](https://img-blog.csdnimg.cn/e5f4289a8baf4d9e89194316204c3ed5.png)
我们可以使用 `git push -f origin master ` 强制提交代码的方式提交上去

### **4.分支常用命令**

`git add -u` 将已跟踪的文件提交到暂存区
`git commit -m <message>` 将暂存区提交到本地仓库
`git commit --amend` 进入 vi 编辑模式，最上方就是提交时填写的备注信息
`git commit -amend -m <message>` 无需进入 vi 编辑模式，修改上次提交记录的备注信息
**commit - message 规范**

```javascript
/**
 1. feat：新增功能
 2. fix：bug 修复
 3. docs：文档更新
 4. style：不影响程序逻辑的代码修改(修改空白字符，格式缩进，补全缺失的分号等，没有改变代码逻辑)
 5. refactor：重构代码(既没有新增功能，也没有修复 bug)
 6. perf：性能, 体验优化
 7. test：新增测试用例或是更新现有测试
 8. build：主要目的是修改项目构建系统(例如 glup，webpack，rollup 的配置等)的提交
 9. ci：主要目的是修改项目继续集成流程(例如 Travis，Jenkins，GitLab CI，Circle等)的提交
 10. chore：不属于以上类型的其他类型，比如构建流程, 依赖管理
 11. revert：回滚某个更早之前的提交
*/
```

### **5.分支冲突解决**

merge：

1.  需要手动解决冲突
2.  解决完冲突之后，就提交代码到暂存区
3.  提交到本地代码仓库
4.  提交到远程仓库

rebase：

1.  首先保证主分支是最新代码
2.  切换到需要合并的分支 `git rebase master `
3.  处理冲突
4.  冲突解决完之后 `git add`
5.  执行 git rebase --continue 操作
6.  git push 完成

### **6.分支管理**

`git branch <branch-name>` 创建分支
`git branch -d <branch-name>` 删除分支
`git branch -D <branch-name>` 强制删除分支
`git checkout <branch-name>` 切换分支
`git checkout -b <new-branch-name>` 创建新分支并且切换分支
`git branch --set-upstream-to=origin/<branch-name>` 设置本地分支与远程分支的链接
`git push origin --delete <branch-name>` 删除远程分支
`git push origin --delete <branch-name>` 删除远程分支

### **7. `hard` 和 `soft` 的区别**

对于`git reset`我们在日常主要是使用其两种模式，分别为`hard`与`soft`模式。

-   对于`git reset --hard`的作用是代码强制回溯到某节点，对于当前节点 -> 回溯节点中间已`commit`的内容就会全部消失。
-   而`git reset --soft`模式下与`hard`模式会有所不同，他会保存当前节点 -> 回溯节点之间已保存的内容。

`git reset --hard` 重置工作区，暂存区，以及本地仓库的代码
`git reset --soft` 重置暂存区，本地仓库的代码

总结一下 hard 与 soft 的区别：

-   `hard`模式下，代码会回溯到某节点，对于当前节点 -> 回溯节点中间已`commit`的内容就会全部消失。
-   而`soft`模式下，代码会回溯到某节点，对于当前节点 -> 回溯节点中间已`commit`的内容会保留。


### **8. 合并 `commit` **

`git rebase -i <commit-id>`


```
interactive: 打开一个交互式的界面，允许对rebase操作进行更多的控制。也可以重新排序、编辑或删除提交，甚至可以合并多个提交为一个 (缩写:i)
pick：保留该commit（缩写:p）
reword：保留该commit，但我需要修改该commit的注释（缩写:r）
edit：保留该commit, 但我要停下来修改该提交(不仅仅修改注释)（缩写:e）
squash：将该commit和前一个commit合并（缩写:s）
fixup：将该commit和前一个commit合并，但我不要保留该提交的注释信息（缩写:f）
exec：执行shell命令（缩写:x）
drop：我要丢弃该commit（缩写:d）
```

`git merge <barnch-name>` 合并分支下的所有commit
`git merge --squash <barnch-name>` 合并分支下的所有commit，但是不产生新的commit


**TIP** 合并一个 `commit`

`git cherry-pick <commit-id>` 合并一个 `commit`。(`commit-id` 可以通过 `git log` 命令查看，也可以理解成是 `commit` 哈希值。)

