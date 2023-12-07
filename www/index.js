let txt = null;

const onDOMContentLoaded = async () => {
    txt = document.getElementById('txt');
    txt.innerText = "Loading kernel...";

    var consoleText = "";

    const response = await fetch('warm64.img');
    if (!response.ok) {
        txt.innerText = "Failed to load warm64.img";
    } else {
        const code = new Uint8Array(await response.arrayBuffer());
        const e = new uc.Unicorn(uc.ARCH_ARM64, uc.MODE_ARM);
        // Linker script assumes base address of 0x80000
        const code_base = 0x80000;
        // ~131KB
        const code_size = 0x20000;
        const stack_size = 0x1000;
        const heap_addr = 0xA0000;
        const heap_size = 0x4000;
        const stack_addr = code_base - stack_size;
        // Image
        e.mem_map(code_base, code_size, uc.PROT_ALL);
        // Stack
        e.mem_map(stack_addr, stack_size, uc.PROT_ALL);
        // Heap
        e.mem_map(heap_addr, heap_size, uc.PROT_ALL);

        e.mem_write(code_base, code)

        const mmio_base = 0x1000;
        // "MMIO"
        e.mem_map(mmio_base, 0x1000, uc.PROT_ALL);

        //e.hook_add(uc.HOOK_MEM_WRITE_UNMAPPED, (handle, type, addr_lo, addr_hi, size, value_lo, value_hi, user_data) => {
        //    if (addr_lo == mmio_base) {
        //        console.log("Syscall?");
        //        return false;
        //    }
        //    console.log("Mem write unmapped: " + addr_lo.toString(16));
        //    return true;
        //});

        e.hook_add(uc.HOOK_MEM_WRITE, (handle, type, addr_lo, addr_hi, size, value_lo, value_hi, user_data) => {
            if (addr_lo == mmio_base) {
                //console.log("MMIO");
                consoleText += String.fromCharCode(value_lo);
                txt.innerText = consoleText;
            } else {
                //console.log("Mem write: " + addr_lo.toString(16));
            }
        });

        //e.hook_add(uc.HOOK_MEM_READ, (handle, type, addr_lo, addr_hi, size, value_lo, value_hi, user_data) => {
        //    console.log("Mem read: " + addr_lo.toString(16));
        //});
        //e.hook_add(uc.HOOK_CODE, (handle, addr_lo, addr_hi, size, user_data) => {
        //    console.log("Code execute: " + addr_lo.toString(16));
        //});

        var begin = code_base;
        // Not realy needed?
        var until = code_base + code_size;

        try {
            txt.innerText = "";
            // TODO: Do one instruction at a time maybe and show registers?
            e.emu_start(begin, until, 0, 0);
        } catch (e) {
            console.log(e);
        }

    }
};

document.addEventListener('DOMContentLoaded', onDOMContentLoaded);