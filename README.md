# visulator [![build status](https://secure.travis-ci.org/thlorenz/visulator.png)](http://travis-ci.org/thlorenz/visulator)

A machine emulator that visualizes how each instruction is processed

## Status

**MAD SCIENCE**

[ Play with it](https://thlorenz.github.io/visulator)

## API and Notes

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [cu::_byteRegPair](#cu_byteregpair)
- [cu::_regPair](#cu_regpair)
- [registers::_flagIndexes](#registers_flagindexes)
- [registers::_flagMasks](#registers_flagmasks)
- [auxiliary(dst, src) → {Boolean}](#auxiliarydst-src-%E2%86%92-boolean)
- [cu::_dec(opcode, asm, nbytes)](#cu_decopcode-asm-nbytes)
- [cu::_inc(opcode, asm, nbytes)](#cu_incopcode-asm-nbytes)
- [cu::_movr(opcode, asm, nbytes)](#cu_movropcode-asm-nbytes)
- [cu::next()](#cunext)
- [cu:_push_reg(opcode)](#cu_push_regopcode)
- [hexstring(x)](#hexstringx)
- [leBytes(val, nbytes) → {Array.<Number>}](#lebytesval-nbytes-%E2%86%92-arraynumber)
- [leVal(bytes, nbytes) → {Number}](#levalbytes-nbytes-%E2%86%92-number)
- [overflow(op1, op2, res, nbytes) → {Boolean}](#overflowop1-op2-res-nbytes-%E2%86%92-boolean)
- [parity(v) → {Number}](#parityv-%E2%86%92-number)
- [registers::_createRegister(k)](#registers_createregisterk)
- [registers::assign(regs)](#registersassignregs)
- [registers::clearFlag(flag)](#registersclearflagflag)
- [registers::getFlag(flag) → {Number}](#registersgetflagflag-%E2%86%92-number)
- [registers::setFlag(flag)](#registerssetflagflag)
- [signed(v, nbytes) → {Boolean}](#signedv-nbytes-%E2%86%92-boolean)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


<!-- START docme generated API please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN docme TO UPDATE -->

<div>
<div class="jsdoc-githubify">
<section>
<article>
<div class="container-overview">
<dl class="details">
</dl>
</div>
<dl>
<dt>
<h4 class="name" id="cu::_byteRegPair"><span class="type-signature"></span>cu::_byteRegPair<span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Used for byte sized operations on registers or a register pair.</p>
<p>In case a register pair is used the names of both registers are provided.
In case only one register is used, the same code is used except we only use
the <strong>first</strong> register of the pair.</p>
</div>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/visulator/blob/master/lib/x86/cu.reg-pair.js">x86/cu.reg-pair.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/visulator/blob/master/lib/x86/cu.reg-pair.js#L61">lineno 61</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="cu::_dwordRegPair"><span class="type-signature"></span>cu::_dwordRegPair<span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Used for any operation that operates on a register pair
mov, add, etc.</p>
<p>Same code used no matter of the pair size dword, word.
For byte size general puropose regs we use @see _byteRegPair instead.</p>
<p>Operations for smaller pairs just have a different
opcode than dword operations prefixing the pair.</p>
<p>Certain operations like add/sub only use first reg of the pair, addressing
it via the pair code.
In that case the operation may also be encoded in the reg pair code, i.e.</p>
<pre><code>add ecx, ...  ; 83 c1 ... uses c1 to indicate ecx
sub ecx, ...  ; 83 e9 ... uses e9 to indicate ecx
cmp ecx, ...  ; 83 f9 ... uses f9 to indicate ecx</code></pre>
</div>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/visulator/blob/master/lib/x86/cu.reg-pair.js">x86/cu.reg-pair.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/visulator/blob/master/lib/x86/cu.reg-pair.js#L10">lineno 10</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="registers::_flagIndexes"><span class="type-signature"></span>registers::_flagIndexes<span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Index of each flag in the eflags register.</p>
</div>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/visulator/blob/master/lib/x86/regs.js">x86/regs.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/visulator/blob/master/lib/x86/regs.js#L176">lineno 176</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="registers::_flagMasks"><span class="type-signature"></span>registers::_flagMasks<span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Flags representation for each case of ONE flag set at a time.
Used to isolate each flag for flag operations</p>
<p><strong>Flag's Meanings</strong></p>
<ul>
<li>CF: <em>carry flag</em> set if the result of an add or shift operation carries out a bit beyond the destination operand;
otherwise cleared</li>
<li>PF: <em>parity flag</em> set if the number of 1-bits in the low byte of the result is even,
otherwise cleared</li>
<li>AF: <em>adjust flag</em> auxiliary carry used for 4-bit BCD math,
set when an operation causes a carry out of a 4-bit BCD quantity</li>
<li>ZF: <em>zero flag</em> set if the result of an operation is zero, otherwise cleared</li>
<li>TF: <em>trap flag</em> for debuggers, permits operation of a processor in single-step mode</li>
<li>SF: <em>sign flag</em> set when the sign of the result forces the destination operand to become negative,
i.e. its most significant bit is set</li>
<li>IF: <em>interrupt enable flag</em> determines whether or not the CPU
will handle maskable hardware interrupts</li>
<li>DF: <em>direction flag</em> controls the left-to-right or right-to-left direction of string processing</li>
<li>OF: <em>overflow flag</em> set if the result is too large to fit in the destination operand</li>
</ul>
<p>see: <a href="http://en.wikipedia.org/wiki/FLAGS_register">wiki flags register</a></p>
</div>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/visulator/blob/master/lib/x86/regs.js">x86/regs.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/visulator/blob/master/lib/x86/regs.js#L126">lineno 126</a>
</li>
</ul></dd>
</dl>
</dd>
</dl>
<dl>
<dt>
<h4 class="name" id="auxiliary"><span class="type-signature"></span>auxiliary<span class="signature">(dst, src)</span><span class="type-signature"> &rarr; {Boolean}</span></h4>
</dt>
<dd>
<div class="description">
<p>Determnies if a carry or borrow has been generated out of the least significant four bits
when adding src to dst
<a href="http://en.wikipedia.org/wiki/Half-carry_flag">wiki</a></p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>dst</code></td>
<td class="type">
<span class="param-type">Number</span>
</td>
<td class="description last"><p>destination register</p></td>
</tr>
<tr>
<td class="name"><code>src</code></td>
<td class="type">
<span class="param-type">Number</span>
</td>
<td class="description last"><p>source register</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/visulator/blob/master/lib/auxiliary.js">auxiliary.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/visulator/blob/master/lib/auxiliary.js#L5">lineno 5</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p><code>true</code> if a <em>half-carry</em> occurs when adding src to dst, otherwise <code>false</code></p>
</div>
<dl>
<dt>
Type
</dt>
<dd>
<span class="param-type">Boolean</span>
</dd>
</dl>
</dd>
<dt>
<h4 class="name" id="cu::_dec"><span class="type-signature"></span>cu::_dec<span class="signature">(opcode, asm, srcbytes, dstbytes)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Decrement a register</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>opcode</code></td>
<td class="type">
</td>
<td class="description last"></td>
</tr>
<tr>
<td class="name"><code>asm</code></td>
<td class="type">
</td>
<td class="description last"></td>
</tr>
<tr>
<td class="name"><code>srcbytes</code></td>
<td class="type">
</td>
<td class="description last"></td>
</tr>
<tr>
<td class="name"><code>dstbytes</code></td>
<td class="type">
</td>
<td class="description last"></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/visulator/blob/master/lib/x86/cu.js">x86/cu.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/visulator/blob/master/lib/x86/cu.js#L206">lineno 206</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="cu::_inc"><span class="type-signature"></span>cu::_inc<span class="signature">(opcode, asm, srcbytes, dstbytes)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Inccrement a register</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>opcode</code></td>
<td class="type">
</td>
<td class="description last"></td>
</tr>
<tr>
<td class="name"><code>asm</code></td>
<td class="type">
</td>
<td class="description last"></td>
</tr>
<tr>
<td class="name"><code>srcbytes</code></td>
<td class="type">
</td>
<td class="description last"></td>
</tr>
<tr>
<td class="name"><code>dstbytes</code></td>
<td class="type">
</td>
<td class="description last"></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/visulator/blob/master/lib/x86/cu.js">x86/cu.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/visulator/blob/master/lib/x86/cu.js#L192">lineno 192</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="cu::_movr"><span class="type-signature"></span>cu::_movr<span class="signature">(opcode, asm, srcbytes)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Moves one register into another.
In order to execute this instruction we read the next code byte.
It tells us which register pairs are affected (i.e. which register
to move into which).</p>
<p>We look these up via a table.</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>opcode</code></td>
<td class="type">
<span class="param-type">Number</span>
</td>
<td class="description last"></td>
</tr>
<tr>
<td class="name"><code>asm</code></td>
<td class="type">
<span class="param-type">String</span>
</td>
<td class="description last"></td>
</tr>
<tr>
<td class="name"><code>srcbytes</code></td>
<td class="type">
<span class="param-type">Number</span>
</td>
<td class="description last"><p>the size of the (sub)register to move</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/visulator/blob/master/lib/x86/cu.js">x86/cu.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/visulator/blob/master/lib/x86/cu.js#L450">lineno 450</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="cu::next"><span class="type-signature"></span>cu::next<span class="signature">()</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Fetches, decodes and executes next instruction and stores result.</p>
<p>This implementation totally ignores a few things about modern processors and instead uses
a much simpler algorithm to fetch and execute instructions and store the results.</p>
<p>Here are some concepts that make modern processors faster, but are not employed here, followed
by the simplified algorightm we actually use here.</p>
<p><strong>Pipelining</strong></p>
<ul>
<li>instructions are processed in a pipe line fashion with about 5 stages, each happening  in parallel
for multiple instructions<ul>
<li>load instruction</li>
<li>decode instruction</li>
<li>fetch data</li>
<li>execute instruction</li>
<li>write results for instruction</li>
</ul>
</li>
<li>at a given time instruction A is loaded,  B is decoded, data is fetched for C, D is executing
and results for E are written</li>
<li>see: <a href="http://www.pctechguide.com/cpu-architecture/moores-law-in-it-architecture">moores-law-in-it-architecture</a></li>
</ul>
<p><strong>Caches</strong></p>
<ul>
<li>modern processors have L1, L2 and L3 caches</li>
<li>L1 and L2 are on the processor while L3 is connected via a high speed bus</li>
<li>data that is used a lot and namely the stack and code about to be executed is usually
found in one of these caches, saving a more expensive trip to main memory</li>
</ul>
<p><strong>Branch Prediction</strong></p>
<ul>
<li>in order to increase speed the processor tries to predict which branch of code is executed
next in order to pre-fetch instructions</li>
<li>IA-64 replaces this by predication which even allows the processor to execute all
possible branch paths in parallel</li>
</ul>
<p><strong>Translation to RISC like micro-instructions</strong></p>
<ul>
<li>starting with the Pentium Pro (P6) instructions are translated into RISC like
micro-instructions</li>
<li>these micro-instructions are then executed (instead of the original ones) on a
highly advanced core</li>
<li>see: <a href="http://www.pctechguide.com/cpu-architecture/pentium-pro-p6-6th-generation-x86-microarchitecture">pentium-pro-p6-6th-generation-x86-microarchitecture</a></li>
</ul>
<p><strong>Simplified Algorithm</strong></p>
<ul>
<li>1) fetch next instruction (always from main memory -- caches don't exist here)</li>
<li>2) decode instruction and decide what to do</li>
<li>3) execute instruction, some directly here and others via the ALU</li>
<li>4) store the result in registers/memory</li>
<li><p>5) goto 1</p>
</li>
<li><p>and 2. basically become one step since we just call a function named after
the opcode of the mnemonic.</p>
</li>
</ul>
<p>We then fetch more bytes from the code in order to complete the instruction from memory (something
that is inefficient and not done in the real world, where multiple instructions are pre-fetched
instead).</p>
<p>The decoder is authored using <a href="http://ref.x86asm.net/coder32.html">this information</a>.</p>
</div>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/visulator/blob/master/lib/x86/cu.js">x86/cu.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/visulator/blob/master/lib/x86/cu.js#L58">lineno 58</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="cu:_push_reg"><span class="type-signature"></span>cu:_push_reg<span class="signature">(opcode)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Push 32 bit register onto stack.
<a href="http://ref.x86asm.net/coder32.html#x50">x50</a></p>
<pre><code class="lang-asm">50   push   eax
51   push   ecx
53   push   ebx
52   push   edx
54   push   esp
55   push   ebp
56   push   esi
57   push   edi</code></pre>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>opcode</code></td>
<td class="type">
</td>
<td class="description last"></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/visulator/blob/master/lib/x86/cu.js">x86/cu.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/visulator/blob/master/lib/x86/cu.js#L163">lineno 163</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="hexstring"><span class="type-signature"></span>hexstring<span class="signature">(x)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Converts given number to a two digit hex str</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>x</code></td>
<td class="type">
<span class="param-type">Number</span>
</td>
<td class="description last"><p>number between 0x00 and 0xff</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/visulator/blob/master/lib/hexstring.js">hexstring.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/visulator/blob/master/lib/hexstring.js#L3">lineno 3</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>two digit string representation</p>
</div>
</dd>
<dt>
<h4 class="name" id="leBytes"><span class="type-signature"></span>leBytes<span class="signature">(val, <span class="optional">nbytes</span>)</span><span class="type-signature"> &rarr; {Array.&lt;Number>}</span></h4>
</dt>
<dd>
<div class="description">
<p>Antidote to leVal.
Converts a value into a buffer of n bytes ordered little endian.</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th>Argument</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>val</code></td>
<td class="type">
<span class="param-type">Number</span>
</td>
<td class="attributes">
</td>
<td class="description last"><p>value 8, 16 or 32 bits</p></td>
</tr>
<tr>
<td class="name"><code>nbytes</code></td>
<td class="type">
<span class="param-type">Number</span>
</td>
<td class="attributes">
&lt;optional><br>
</td>
<td class="description last"><p>number of bytes of the value to include (default: 4)</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/visulator/blob/master/lib/le-bytes.js">le-bytes.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/visulator/blob/master/lib/le-bytes.js#L3">lineno 3</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>byte representation of the given @see val</p>
</div>
<dl>
<dt>
Type
</dt>
<dd>
<span class="param-type">Array.&lt;Number></span>
</dd>
</dl>
</dd>
<dt>
<h4 class="name" id="leVal"><span class="type-signature"></span>leVal<span class="signature">(bytes, <span class="optional">nbytes</span>)</span><span class="type-signature"> &rarr; {Number}</span></h4>
</dt>
<dd>
<div class="description">
<p>Calculates value of little endian ordered bytes.</p>
<pre><code class="lang-js">leVal([ 0x00, 0x00, 0x00, 0x00 ]) // =&gt; 0x00 00 00 ff (            0)
leVal([ 0x01, 0x00, 0x00, 0x00 ]) // =&gt; 0x00 00 00 ff (            1)
leVal([ 0xff, 0x00, 0x00, 0x00 ]) // =&gt; 0x00 00 00 ff (          255)
leVal([ 0x00, 0x01, 0x00, 0x00 ]) // =&gt; 0x00 00 01 00 (          256)
leVal([ 0x01, 0x01, 0x00, 0x00 ]) // =&gt; 0x00 00 01 01 (          257)
leVal([ 0xff, 0x01, 0x00, 0x00 ]) // =&gt; 0x00 00 01 ff (          511)
leVal([ 0xff, 0xff, 0x00, 0x00 ]) // =&gt; 0x00 00 ff ff (       65,535)
leVal([ 0x00, 0x00, 0xff, 0x00 ]) // =&gt; 0x00 ff 00 00 (   16,711,680)
leVal([ 0xff, 0xff, 0xff, 0x00 ]) // =&gt; 0x00 ff ff ff (  16,777,215 )
leVal([ 0x00, 0x00, 0x00, 0x0f ]) // =&gt; 0x0f 00 00 00 ( 251,658,240 )
leVal([ 0x00, 0x00, 0x00, 0xf0 ]) // =&gt; 0xf0 00 00 00 (4,026,531,840)
leVal([ 0x00, 0x00, 0x00, 0xff ]) // =&gt; 0xff 00 00 00 (4,278,190,080)
leVal([ 0xff, 0xff, 0xff, 0xff ]) // =&gt; 0xff ff ff ff (4,294,967,295)</code></pre>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th>Argument</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>bytes</code></td>
<td class="type">
<span class="param-type">Array.&lt;Number></span>
</td>
<td class="attributes">
</td>
<td class="description last"><p>bytes that contain number representation</p></td>
</tr>
<tr>
<td class="name"><code>nbytes</code></td>
<td class="type">
<span class="param-type">Number</span>
</td>
<td class="attributes">
&lt;optional><br>
</td>
<td class="description last"><p>number of bytes, if not given it is deduced</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/visulator/blob/master/lib/le-val.js">le-val.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/visulator/blob/master/lib/le-val.js#L3">lineno 3</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>number contained in bytes</p>
</div>
<dl>
<dt>
Type
</dt>
<dd>
<span class="param-type">Number</span>
</dd>
</dl>
</dd>
<dt>
<h4 class="name" id="overflow"><span class="type-signature"></span>overflow<span class="signature">(op1, op2, res, nbytes)</span><span class="type-signature"> &rarr; {Boolean}</span></h4>
</dt>
<dd>
<div class="description">
<p>Calculates if an overflow occurred due to the last arithmetic operation.</p>
<p>The overflow flag is set when the most significant bit (sign bit) is changed
by adding two numbers with the same sign or subtracting two numbers with opposite signs.</p>
<p>A negative result out of positive operands (or vice versa) is an overflow.</p>
<p><a href="http://en.wikipedia.org/wiki/Overflow_flag">overflow flag</a></p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>op1</code></td>
<td class="type">
<span class="param-type">Number</span>
</td>
<td class="description last"><p>first operand of the arithmetic operation</p></td>
</tr>
<tr>
<td class="name"><code>op2</code></td>
<td class="type">
<span class="param-type">Number</span>
</td>
<td class="description last"><p>second operand of the arithmetic operation</p></td>
</tr>
<tr>
<td class="name"><code>res</code></td>
<td class="type">
<span class="param-type">Number</span>
</td>
<td class="description last"><p>result of the arithmetic operation</p></td>
</tr>
<tr>
<td class="name"><code>nbytes</code></td>
<td class="type">
<span class="param-type">Number</span>
</td>
<td class="description last"><p>byte sizes of the operands and the result</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/visulator/blob/master/lib/overflow.js">overflow.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/visulator/blob/master/lib/overflow.js#L7">lineno 7</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p><code>true</code> if an overflow occurred, otherwise <code>false</code></p>
</div>
<dl>
<dt>
Type
</dt>
<dd>
<span class="param-type">Boolean</span>
</dd>
</dl>
</dd>
<dt>
<h4 class="name" id="parity"><span class="type-signature"></span>parity<span class="signature">(v)</span><span class="type-signature"> &rarr; {Number}</span></h4>
</dt>
<dd>
<div class="description">
<p>Calculates parity of a given number and returns value to set parity flag to.</p>
<p>Mostly used to check for serial data communications correctness checking:</p>
<blockquote>
<p>parity bit, or check bit is a bit added to the end of a string of binary code that indicates whether the number of
bits in the string with the value one is even or odd. Parity bits are used as the simplest form of error detecting
code.
To determine odd parity if the sum of bits with a value of 1 is odd, the parity bit's value is set to zero.</p>
</blockquote>
<ul>
<li><a href="http://en.wikipedia.org/wiki/Parity_flag">parity-flag</a></li>
<li><a href="http://en.wikipedia.org/wiki/Parity_bit">parity-bit</a></li>
</ul>
<p><strong>Summary</strong>
- parity flag is set to <code>0</code> if the number of set bits is odd
- parity flag is set to <code>1</code> if the number of set bits is even</p>
<p>This method takes around 9 operations, and works for 32-bit words.
It first shifts and XORs the eight nibbles of the 32-bit value together, leaving the result in the lowest
nibble of v.
Next, the binary number 0110 1001 1001 0110 (0x6996 in hex) is shifted to the right by the value
represented in the lowest nibble of v.
This number is like a miniature 16-bit parity-table indexed by the low four
bits in v.
The result has the parity of v in bit 1, which is masked and returned.</p>
<p><a href="http://graphics.stanford.edu/~seander/bithacks.html#ParityParallel">bithacks</a></p>
<p>x86 parity only applies to the low 8 bits
<a href="https://github.com/asmblah/jemul8/blob/2e0357116d7a9f500dc21e443e3a2ffde8ee9f8a/js/util.js#L118">x86 caveat</a></p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>v</code></td>
<td class="type">
<span class="param-type">Number</span>
</td>
<td class="description last"><p>32-bit number to get parity for</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/visulator/blob/master/lib/parity.js">parity.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/visulator/blob/master/lib/parity.js#L3">lineno 3</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p><code>0</code> if odd, otherwise <code>1</code></p>
</div>
<dl>
<dt>
Type
</dt>
<dd>
<span class="param-type">Number</span>
</dd>
</dl>
</dd>
<dt>
<h4 class="name" id="registers::_createRegister"><span class="type-signature"></span>registers::_createRegister<span class="signature">(k)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Registers are stored as a 4 byte array in order to allow
accessing sub registers like ax, ah and al easily.</p>
<p>The byte order is little endian to be consistent with how things are
stored in memory and thus be able to use the same store/load functions
we use for the latter.</p>
<p>As an example <strong>eax</strong> is stored as follows:</p>
<pre><code class="lang-js">this._eax = [
0x0 // al
, 0x0 // ah
, 0x0 // lower byte of upper word
, 0x0 // upper byte of upper word
]</code></pre>
<p>Each register part can be accessed via a property, i.e. regs.ah, regs.ax.</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>k</code></td>
<td class="type">
<span class="param-type">String</span>
</td>
<td class="description last"><p>the name of the register</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/visulator/blob/master/lib/x86/regs.js">x86/regs.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/visulator/blob/master/lib/x86/regs.js#L44">lineno 44</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="registers::assign"><span class="type-signature"></span>registers::assign<span class="signature">(regs)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Assigns given registers with the supplied values.
Leaves all other flags alone.</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>regs</code></td>
<td class="type">
</td>
<td class="description last"></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/visulator/blob/master/lib/x86/regs.js">x86/regs.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/visulator/blob/master/lib/x86/regs.js#L264">lineno 264</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="registers::clearFlag"><span class="type-signature"></span>registers::clearFlag<span class="signature">(flag)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Clears a given flag</p>
<p>First we invert the mask for the flag to clear.
Then we <code>and</code> the flags with that mask which clears
our flag since that's the only bit in the mask that's <code>0</code>.</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>flag</code></td>
<td class="type">
</td>
<td class="description last"></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/visulator/blob/master/lib/x86/regs.js">x86/regs.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/visulator/blob/master/lib/x86/regs.js#L238">lineno 238</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="registers::getFlag"><span class="type-signature"></span>registers::getFlag<span class="signature">(flag)</span><span class="type-signature"> &rarr; {Number}</span></h4>
</dt>
<dd>
<div class="description">
<p>Returns a given flag</p>
<p> First masks out the bit of the flag we are interested in
and then shifts our flag bit into lowest bit.</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>flag</code></td>
<td class="type">
</td>
<td class="description last"></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/visulator/blob/master/lib/x86/regs.js">x86/regs.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/visulator/blob/master/lib/x86/regs.js#L206">lineno 206</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p><code>1</code> if flag is set, otherwise <code>0</code></p>
</div>
<dl>
<dt>
Type
</dt>
<dd>
<span class="param-type">Number</span>
</dd>
</dl>
</dd>
<dt>
<h4 class="name" id="registers::setFlag"><span class="type-signature"></span>registers::setFlag<span class="signature">(flag)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Sets a given flag</p>
<p> <code>or</code>s flags with mask that will preserve all other flags and set
our flag since that bit is set in the mask.</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>flag</code></td>
<td class="type">
</td>
<td class="description last"></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/visulator/blob/master/lib/x86/regs.js">x86/regs.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/visulator/blob/master/lib/x86/regs.js#L220">lineno 220</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="signed"><span class="type-signature"></span>signed<span class="signature">(v, nbytes)</span><span class="type-signature"> &rarr; {Boolean}</span></h4>
</dt>
<dd>
<div class="description">
<p>Determines if a number is signed, i.e. the most significant bit is set</p>
<p><a href="http://graphics.stanford.edu/~seander/bithacks.html#CopyIntegerSign">bithacks</a></p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>v</code></td>
<td class="type">
<span class="param-type">Number</span>
</td>
<td class="description last"><p>to check for signedness</p></td>
</tr>
<tr>
<td class="name"><code>nbytes</code></td>
<td class="type">
<span class="param-type">Number</span>
</td>
<td class="description last"><p>size of the value in bytes</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/visulator/blob/master/lib/signed.js">signed.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/visulator/blob/master/lib/signed.js#L6">lineno 6</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p><code>true</code> if number is signed, otherwise <code>false</code></p>
</div>
<dl>
<dt>
Type
</dt>
<dd>
<span class="param-type">Boolean</span>
</dd>
</dl>
</dd>
</dl>
</article>
</section>
</div>

*generated with [docme](https://github.com/thlorenz/docme)*
</div>
<!-- END docme generated API please keep comment here to allow auto update -->

## License

GPL3
