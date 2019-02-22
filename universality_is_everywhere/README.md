### 部分再帰関数(partial recursive function)
部分再帰関数は以下の4つの要素で構成されたプログラム
 - zero
 - increment
 - recursive
 - minimize

このうち上3つのみで構成されるプログラムは**原始再帰関数(primitive recursive function)**と呼ばれる。原子再帰関数は*全域的(total)*である。全域的とはどのような入力に対しても必ず停止して答えを返すことである。原子再帰関数は万能ではなく、万能となるためには第4の構成要素minimizeを追加する必要がある。4つの構成要素で組まれるプログラムを**部分再帰関数(partial recursive function)**と呼ぶ。